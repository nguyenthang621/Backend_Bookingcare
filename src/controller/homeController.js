import db from '../models';
import CRUDServices from '../services/CRUDServices';
let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('./homePage.ejs', { data: data[0] });
    } catch (error) {
        console.log('error::::', error);
    }
};

let createCRUD = async (req, res) => {
    return res.render('./crud.ejs');
};

let postCRUD = async (req, res) => {
    let message = await CRUDServices.createNewUser(req.body);
    console.log(message);
    return res.send('send done');
};

let getCRUD = async (req, res) => {
    let dataUsers = await CRUDServices.getAllUsers();
    return res.render('./showCRUD.ejs', { data: dataUsers });
};

let getUserEdit = async (req, res) => {
    let userId = req.params.id;
    let data = await CRUDServices.getUserById(userId);
    return res.render('./editUser.ejs', { data: data });
};

let updateUser = async (req, res) => {
    var dataUser = req.body;
    await CRUDServices.updateUserById(dataUser);
    return res.redirect('/get-crud');
};

let deleteUser = async (req, res) => {
    let userId = req.params.id;
    if (userId) {
        await CRUDServices.deleteUserById(userId);
        return res.redirect('/get-crud');
    } else {
        res.send('user not found');
    }
};
module.exports = {
    getHomePage,
    createCRUD,
    postCRUD,
    getCRUD,
    getUserEdit,
    updateUser,
    deleteUser,
};
