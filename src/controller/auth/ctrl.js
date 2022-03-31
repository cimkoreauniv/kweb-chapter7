//const express = require('express');
const { UserDAO } = require('../../DAO');
const { generatePassword, verifyPassword } = require('../../lib/authentication');

const signInForm = async (req, res, next) => {
    try {
        const { user } = req.session;
        if (user) return res.redirect('/');
        return res.render('auth/sign-in.pug', { user });
    } catch (err) {
        next(err);
    }
};

const signIn = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!(username && password))
            throw new Error("BAD_REQUEST");

        const user = await UserDAO.getByUsername(username);
        if (!user) throw new Error('UNAUTHORIZED');

        const isValidPassword = await verifyPassword(password, user.password);
        console.log(isValidPassword);
        if (!isValidPassword) throw new Error('UNAUTHORIZED');

        req.session.user = {
            id: user.id,
            username,
            displayName: user.displayName,
            isStaff: user.isStaff,
            isActive: user.isActive
        };

        return res.redirect('/');
    } catch (err) {
        next(err);
    }
};

const signUpForm = async (req, res, next) => {
    try {
        const { user } = req.session;
        return res.render('auth/sign-up.pug', { user });
    } catch (err) {
        next(err);
    }
};

const signUp = async (req, res, next) => {
    try {
        const { username, password, displayName } = req.body;
        if (!username || username.length > 16 || !password || !displayName || displayName.length > 32)
            throw new Error('BAD_REQUEST');
        hashedPassword = await generatePassword(password);
        UserDAO.create(username, hashedPassword, displayName);
        return res.redirect('/auth/sign_in');
    } catch (err) {
        next(err);
    }
};

const signOut = async (req, res, next) => {
    try {
        req.session.destroy(err => {
            if (err) throw err;
            else return res.redirect('/');
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signInForm,
    signIn,
    signUpForm,
    signUp,
    signOut,
};