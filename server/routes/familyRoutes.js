const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const gedcom = require('parse-gedcom');

router.get('/family-tree', async (req, res) => {
    try {
        const gedcomData = await fs.readFile('mocks/WalentyFamilyTree.ged', 'utf8');
        const parsedData = gedcom.parse(gedcomData);
        const records = parsedData.children;

        // 1) Zbierz osoby (INDI) jako płaskie obiekty
        const individualsList = records
            .filter(node => node.type === 'INDI')
            .map(person => {
                const id = person.data?.xref_id;
                const rawName = person.children.find(c => c.type === 'NAME')?.value || 'Unknown';
                // Opcjonalne czyszczenie slashes z GEDCOM (np. "Jan /Kowalski/")
                const name = typeof rawName === 'string' ? rawName.replace(/\//g, '').trim() : rawName;

                const birthDate = person.children
                    .find(c => c.type === 'BIRT')
                    ?.children
                    ?.find(c => c.type === 'DATE')
                    ?.value;

                // NOWE: płeć z tagu SEX (np. "M" lub "F")
                const gender = person.children.find(c => c.type === 'SEX')?.value;

                const attributes = {};
                if (birthDate) attributes.birth = birthDate;
                // opcjonalnie zdubluj w attributes, jeśli chcesz trzymać wszystko w jednym miejscu
                if (gender) attributes.gender = gender;

                return {
                    id,
                    name,
                    gender, // <- udostępniamy bezpośrednio
                    parents: [],
                    children: [],
                    spouses: [],
                    attributes
                };
            });

        // 2) Mapuj po ID dla szybkich aktualizacji relacji
        const individualsMap = new Map(individualsList.map(p => [p.id, p]));

        // Pomocnicza funkcja do unikalnego dodawania
        const addUnique = (arr, val) => {
            if (val && !arr.includes(val)) arr.push(val);
        };

        // 3) Przetwórz rodziny (FAM) aby zbudować relacje
        const families = records.filter(node => node.type === 'FAM');

        for (const fam of families) {
            const husbId = fam.children.find(c => c.type === 'HUSB')?.data?.pointer;
            const wifeId = fam.children.find(c => c.type === 'WIFE')?.data?.pointer;

            const childIds = fam.children
                .filter(c => c.type === 'CHIL')
                .map(c => c.data?.pointer)
                .filter(Boolean);

            // Powiązania małżeńskie (spouses) – jeśli obie osoby istnieją
            const husb = husbId ? individualsMap.get(husbId) : undefined;
            const wife = wifeId ? individualsMap.get(wifeId) : undefined;

            if (husb && wife) {
                addUnique(husb.spouses, wife.id);
                addUnique(wife.spouses, husb.id);
            }

            // Dzieci i rodzice (parents/children)
            for (const childId of childIds) {
                const child = individualsMap.get(childId);
                if (!child) continue;

                // Dodaj rodziców do dziecka (jeśli istnieją)
                if (husb) addUnique(child.parents, husb.id);
                if (wife) addUnique(child.parents, wife.id);

                // Dodaj dziecko do rodziców (jeśli istnieją)
                if (husb) addUnique(husb.children, child.id);
                if (wife) addUnique(wife.children, child.id);
            }
        }

        // 4) Wynik jako płaska lista
        const familyTree = Array.from(individualsMap.values());

        res.json(familyTree);
    } catch (error) {
        console.error('Błąd podczas przetwarzania pliku GEDCOM:', error);
        res.status(500).json({ message: 'Błąd podczas przetwarzania pliku GEDCOM' });
    }
});

module.exports = router;
