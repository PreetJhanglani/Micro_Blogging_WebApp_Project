const express = require('express');
const router = express.Router();
const data = require('../data');
const courseData = data.courses;


router.get('/', async (req, res) => {
    res.render('edu/searchIndex', { title: `course Finder` });
});

router.post('/', async (req, res) => {
    const createResData = req.body;
    try {
        const { name, branch } = createResData;
        try {
            if (!name) throw 'All fields need to have valid values';
            if (!branch) throw 'All fields need to have valid values';

            if (typeof name !== 'string') throw 'Name must be a string';
            if (typeof branch !== 'string') throw 'Branch must be a string';
            if (name.trim().length === 0) throw 'name cannot be an empty string or just spaces';
            if (branch.trim().length === 0) throw 'Branch cannot be an empty string or just spaces';


        } catch (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        const newCourse = await courseData.create(name, branch);
        res.status(200).json(newCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/searchcourses', async (req, res) => {
        let bodyData = req.body;
        console.log(bodyData)
        if (!bodyData.courseSearchTerm || bodyData.courseSearchTerm.trim() === '') {
            return res.status(400).json({ status: 400, error: `No search term provided.`, home: "http://localhost:3000" });
        }
        try {
            var result = await courseData.getCourseByName(bodyData.courseSearchTerm);
        } catch (error) {
            console.log(error)
        }
        let error = '';
         let hasError = false;
        if (!result) {
            console.log( 'No course found for the given search term')
             hasError = true;
               error = `We're sorry, but no results were found for ${bodyData.courseSearchTerm}.`
        } 
       
        res.render('edu/search', { title: `courses Found`, data: result, courseSearchTerm: bodyData.courseSearchTerm, error: error, hasError: hasError});

        //     // let resultArr = [];
        //     // for (let i = 0; i < result.length ; i++) {
        //     //     resultArr.push(result[i]);
        //     //      }
        //     let error = '';
        //     let hasError = false;
        //     if (!result) {
        //         hasError = true;
        //         error = `We're sorry, but no results were found for ${bodyData.courseSearchTerm}.`
        //     }
        //     res.render('edu/search', { title: `courses Found`, data: result, courseSearchTerm: bodyData.courseSearchTerm, error: error, hasError: hasError });
        // }

        //     catch (error) {
        //         console.log(error)
        //         throw new Error(error.message);
        // }
    });

router.get('/course/:id', async (req, res) => {
    if (!req.params.id && req.params.id.trim() === '') {
        return res.status(400).json({ status: 400, error: `Invalid id`, home: "http://localhost:3000" });
    }
    let result = await courseData.getCourseById(req.params.id);
    let error = '';
    let hasError = false;
    if (!result) {
        hasError = true;
        error = `No courses found for the given id ${req.params.id}`
        return res.status(404).json({ error: error });
    }

    res.render('edu/courseContent', { title: result.name, data: result, error: error, hasError: hasError });
});




module.exports = router;
