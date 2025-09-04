import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Tree from 'react-d3-tree';
import Sidebar from '../../components/Sidebar';

const FamilyPage = () => {
    const [treeData, setTreeData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/family-tree')
            .then(res => res.json())
            .then(data => {
                console.log('Dane osobowe (format płaski):', data);

                const byId = new Map(data.map(p => [p.id, p]));

                const getGender = (p) => p?.gender || p?.attributes?.gender || '';
                const getBirth = (p) => p?.attributes?.birth || '';
                const getName = (p) => p?.name || '';

                // Dzieci danej pary (oboje w parents)
                const getChildrenOfCouple = (aId, bId) => {
                    return data
                        .filter(ch => Array.isArray(ch.parents)
                            && ch.parents.includes(aId)
                            && ch.parents.includes(bId))
                        .map(ch => ch.id);
                };

                // Dzieci przypisane do jednego rodzica, bez pewnego drugiego
                const getSingleParentChildren = (parentId, spouseIds) => {
                    return data
                        .filter(ch => Array.isArray(ch.parents) && ch.parents.includes(parentId))
                        .filter(ch => {
                            const otherParents = (ch.parents || []).filter(pid => pid !== parentId);
                            return otherParents.length === 0 || !otherParents.some(pid => spouseIds.includes(pid));
                        })
                        .map(ch => ch.id);
                };

                // ... existing code ...
                const buildPersonNode = (personId, visited = new Set()) => {
                    if (!personId) return null;
                    if (visited.has(personId)) return null;
                    const person = byId.get(personId);
                    if (!person) return null;

                    const localVisited = new Set(visited);
                    localVisited.add(personId);

                    const spouses = Array.isArray(person.spouses) ? person.spouses : [];

                    // Jeśli są małżeństwa: zwróć bezpośrednio węzeł(e) "couple" zamiast duplikować węzeł osoby
                    if (spouses.length > 0) {
                        const coupleNodes = spouses
                            .map(spouseId => {
                                const spouse = byId.get(spouseId);
                                if (!spouse) return null;

                                const coupleChildrenIds = getChildrenOfCouple(person.id, spouse.id);
                                const coupleChildren = coupleChildrenIds
                                    .map(cid => buildPersonNode(cid, localVisited))
                                    .filter(Boolean);

                                return {
                                    type: 'couple',
                                    name: `${getName(person)} + ${getName(spouse)}`,
                                    attributes: {
                                        coupleOf: [person.id, spouse.id],
                                        a: {
                                            id: person.id,
                                            name: getName(person),
                                            gender: getGender(person),
                                            birth: getBirth(person)
                                        },
                                        b: {
                                            id: spouse.id,
                                            name: getName(spouse),
                                            gender: getGender(spouse),
                                            birth: getBirth(spouse)
                                        }
                                    },
                                    children: coupleChildren
                                };
                            })
                            .filter(Boolean);

                        // Jeden małżonek: zwróć pojedynczy węzeł "couple"
                        if (coupleNodes.length === 1) {
                            return coupleNodes[0];
                        }

                        // Wielu małżonków: kontener niewidoczny "unions" trzymający kilka "couple"
                        return {
                            type: 'unions',
                            name: getName(person), // nazwa nie jest renderowana (niewidoczny węzeł)
                            attributes: {
                                id: person.id,
                                gender: getGender(person),
                                birth: getBirth(person)
                            },
                            children: coupleNodes
                        };
                    }

                    // Brak małżeństw: węzeł osoby + ewentualne dzieci z nieznanym partnerem
                    const singleParentChildIds = getSingleParentChildren(person.id, spouses);
                    const singleParentChildren = singleParentChildIds
                        .map(cid => buildPersonNode(cid, localVisited))
                        .filter(Boolean);

                    const singleParentNode = singleParentChildIds.length > 0
                        ? [{
                            type: 'single',
                            name: `${getName(person)} (dzieci z nieznanym partnerem)`,
                            attributes: {
                                a: {
                                    id: person.id,
                                    name: getName(person),
                                    gender: getGender(person),
                                    birth: getBirth(person)
                                }
                            },
                            children: singleParentChildren
                        }]
                        : [];

                    return {
                        type: 'person',
                        name: getName(person),
                        attributes: {
                            id: person.id,
                            gender: getGender(person),
                            birth: getBirth(person)
                        },
                        children: singleParentNode
                    };
                };
                // ... existing code ...

                const startPerson = data[0];
                const treeStructure = buildPersonNode(startPerson?.id);
                setTreeData(treeStructure);
            })
            .catch(err => console.error('Błąd podczas pobierania danych:', err));
    }, []);

    const renderNodeElement = (rd3tProps) => {
        const type = rd3tProps.nodeDatum.type || 'person';

        // Niewidoczny kontener dla wielu małżeństw
        if (type === 'unions') {
            return (
                <g>
                    {/* Węzeł bez rysowania prostokąta/tekstu, tylko punkt zaczepu dla krawędzi */}
                </g>
            );
        }

        if (type === 'couple') {
            const a = rd3tProps.nodeDatum.attributes.a;
            const b = rd3tProps.nodeDatum.attributes.b;

            const w = 260;
            const h = 72;
            const half = w / 2;

            return (
                <g>
                    <rect
                        x={-w / 2}
                        y={-h / 2}
                        width={w}
                        height={h}
                        rx="10"
                        ry="10"
                        fill="#FFFFFF"
                        stroke="#BDBDBD"
                    />
                    <rect
                        x={-w / 2}
                        y={-h / 2}
                        width={half}
                        height={h}
                        rx="10"
                        ry="10"
                        fill={a.gender === 'M' ? '#E3F2FD' : '#FCE4EC'}
                        stroke={a.gender === 'M' ? '#64B5F6' : '#F48FB1'}
                    />
                    <rect
                        x={-w / 2 + half}
                        y={-h / 2}
                        width={half}
                        height={h}
                        rx="10"
                        ry="10"
                        fill={b.gender === 'M' ? '#E3F2FD' : '#FCE4EC'}
                        stroke={b.gender === 'M' ? '#64B5F1' : '#F48FB1'}
                    />
                    <text x={-half / 2} y={-8} textAnchor="middle" style={{ fontSize: '11px', fontFamily: 'Arial' }}>
                        {a.name}
                    </text>
                    <text x={-half / 2} y={12} textAnchor="middle" style={{ fontSize: '11px', fontFamily: 'Arial' }}>
                        {a.birth}
                    </text>
                    <text x={half / 2} y={-8} textAnchor="middle" style={{ fontSize: '11px', fontFamily: 'Arial' }}>
                        {b.name}
                    </text>
                    <text x={half / 2} y={12} textAnchor="middle" style={{ fontSize: '11px', fontFamily: 'Arial' }}>
                        {b.birth}
                    </text>
                </g>
            );
        }

        if (type === 'single') {
            const a = rd3tProps.nodeDatum.attributes.a;
            const w = 160;
            const h = 60;

            return (
                <g>
                    <rect
                        x={-w / 2}
                        y={-h / 2}
                        width={w}
                        height={h}
                        rx="10"
                        ry="10"
                        fill={a.gender === 'M' ? '#E3F2FD' : '#FCE4EC'}
                        stroke={a.gender === 'M' ? '#64B5F6' : '#F48FB1'}
                    />
                    <text y={-6} textAnchor="middle" style={{ fontSize: '11px', fontFamily: 'Arial' }}>
                        {a.name}
                    </text>
                    <text y={12} textAnchor="middle" style={{ fontSize: '11px', fontFamily: 'Arial' }}>
                        {a.birth}
                    </text>
                </g>
            );
        }

        // Domyślnie: pojedyncza osoba (gdy brak małżeństw)
        return (
            <g>
                <rect
                    x="-70"
                    y="-28"
                    width="140"
                    height="56"
                    rx="8"
                    ry="8"
                    fill={rd3tProps.nodeDatum.attributes.gender === 'M' ? '#E3F2FD' : '#FCE4EC'}
                    stroke={rd3tProps.nodeDatum.attributes.gender === 'M' ? '#64B5F6' : '#F48FB1'}
                />
                <text dy="-6" textAnchor="middle" style={{ fontSize: '12px', fontFamily: 'Arial' }}>
                    {rd3tProps.nodeDatum.name}
                </text>
                <text dy="14" textAnchor="middle" style={{ fontSize: '11px', fontFamily: 'Arial' }}>
                    {rd3tProps.nodeDatum.attributes.birth}
                </text>
            </g>
        );
    };

    return (
        <Box display="flex">
            <Sidebar />
            <Box m="20px" ml="270px" flexGrow={1} height="calc(100vh - 40px)">
                {treeData && (
                    <Tree
                        data={treeData}
                        orientation="vertical"
                        pathFunc="step"
                        translate={{ x: window.innerWidth / 3, y: 70 }}
                        nodeSize={{ x: 260, y: 140 }}
                        separation={{ siblings: 1.2, nonSiblings: 1.6 }}
                        renderCustomNodeElement={renderNodeElement}
                        zoomable={true}
                    />
                )}
            </Box>
        </Box>
    );
};

export default FamilyPage;
