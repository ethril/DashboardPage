const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const gedcom = require('parse-gedcom');

router.get('/family-tree', async (req, res) => {
    try {
        const gedcomData = await fs.readFile('mocks/WalentyFamilyTree.ged', 'utf8');
        const parsedData = gedcom.parse(gedcomData);
        const records = parsedData.children;

        const familyTree = records
            .filter(node => node.type === 'INDI')
            .map(person => ({
                id: person.data?.xref_id,
                name: person.children.find(c => c.type === 'NAME')?.value || 'Unknown',
                gender: person.children.find(c => c.type === 'SEX')?.value,
                birthDate: person.children
                    .find(c => c.type === 'BIRT')
                    ?.children
                    ?.find(c => c.type === 'DATE')
                    ?.value,
                parents: records
                    .filter(node => node.type === 'FAM')
                    .filter(fam => fam.children.some(c =>
                        c.type === 'CHIL' && c.data?.pointer === person.data?.xref_id
                    ))
                    .map(fam => ({
                        father: fam.children.find(c => c.type === 'HUSB')?.data?.pointer,
                        mother: fam.children.find(c => c.type === 'WIFE')?.data?.pointer
                    }))
            }));

        res.json(familyTree);
    } catch (error) {
        console.error('Błąd podczas przetwarzania pliku GEDCOM:', error);
        res.status(500).json({ message: 'Błąd podczas przetwarzania pliku GEDCOM' });
    }
});

module.exports = router;