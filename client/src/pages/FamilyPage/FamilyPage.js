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
                //console.log('Dane osobowe:', data);
                const buildTree = (personId, processedIds = new Set()) => {
                    if (processedIds.has(personId)) return null;
                    processedIds.add(personId);

                    const person = data.find(p => p.id === personId);
                    if (!person) return null;

                    const [firstName, lastName] = person.name.split(' /').map(part =>
                        part.replace('/', '')
                    );
                    if(firstName == 'Antoni') console.log(person);
                    // Budowanie gałęzi rodziców
                    let parents = [];
                    if (person.parents && person.parents.length > 0) {
                        const parentInfo = person.parents[0];
                        if (parentInfo.father) {
                            const fatherNode = buildTree(parentInfo.father, processedIds);
                            if (fatherNode) parents.push(fatherNode);
                        }
                        if (parentInfo.mother) {
                            const motherNode = buildTree(parentInfo.mother, processedIds);
                            if (motherNode) parents.push(motherNode);
                        }
                    }

                    // Budowanie gałęzi dzieci
                    const children = data
                        .filter(p => p.parents.some(fam =>
                            fam.father === person.id || fam.mother === person.id
                        ))
                        .map(child => buildTree(child.id, processedIds))
                        .filter(Boolean);

                    return {
                        name: `${firstName} ${lastName}`,
                        attributes: {
                            birthDate: person.birthDate || '',
                            gender: person.gender,
                            id: person.id
                        },
                        children: [...parents, ...children]
                    };
                };

                // Wybierz osobę startową (np. pierwszą z listy lub konkretną po ID)
                const startPerson = data[0]; // możesz zmienić indeks lub wybrać po ID
                const treeStructure = buildTree(startPerson.id);
                setTreeData(treeStructure);
            })
            .catch(err => console.error('Błąd podczas pobierania danych:', err));
    }, []);

    const renderNodeElement = (rd3tProps) => (
        <g>
            <rect
                x="-60"
                y="-25"
                width="120"
                height="50"
                rx="5"
                ry="5"
                fill={rd3tProps.nodeDatum.attributes.gender === 'M' ? '#E3F2FD' : '#FCE4EC'}
                stroke={rd3tProps.nodeDatum.attributes.gender === 'M' ? '#64B5F6' : '#F48FB1'}
                //strokeWidth="2"
            />
            <text
                dy="-5"
                textAnchor="middle"
                style={{
                    fontSize: '11px',
                    fontWeight: 'normal !important',
                    fontFamily: 'Arial'
                }}
            >
                {rd3tProps.nodeDatum.name}
            </text>
            <text
                dy="15"
                textAnchor="middle"
                style={{
                    fontSize: '11px',
                    fontWeight: 'normal !important',
                    fontFamily: 'Arial'
                }}
            >
                {rd3tProps.nodeDatum.attributes.birthDate}
            </text>
        </g>
    );

    return (
        <Box display="flex">
            <Sidebar />
            <Box m="20px" ml="270px" flexGrow={1} height="calc(100vh - 40px)">
                {treeData && (
                    <Tree
                        data={treeData}
                        orientation="vertical"
                        pathFunc="step"
                        translate={{ x: window.innerWidth / 3, y: 50 }}
                        nodeSize={{ x: 180, y: 100 }}
                        separation={{ siblings: 1.5, nonSiblings: 2 }}
                        renderCustomNodeElement={renderNodeElement}
                        zoomable={true}
                    />
                )}
            </Box>
        </Box>
    );
};

export default FamilyPage;