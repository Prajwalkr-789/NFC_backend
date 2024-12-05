const crypto = require('crypto');
const User = require('../models/User');
const express = require('express');
const Tag = require('../models/Tag');
require('dotenv').config();

const GLOBAL_KEY = "ef8254f33bfb45f0560bd466ba51360c"; 

const addUser = async (req, res) => {
    const { name, phoneNumber, address } = req.body;

    if (!address || !name || !phoneNumber) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const newUser = new User({ name, phoneNumber, address });
        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User successfully added.',
            user: newUser,
        });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Could not save user.',
        });
    }
};

// Utility for AES encryption
const encryptAES = (data, key) => {
    try {
        const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(key, 'hex'), null);
        return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    } catch (error) {
        console.error('Error during encryption:', error);
        throw new Error('Encryption failed');
    }
};

// Utility for AES decryption
const decryptAES = (data, key) => {
    try {
        const decipher = crypto.createDecipheriv('aes-128-ecb', Buffer.from(key, 'hex'), null);
        return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
    } catch (error) {
        console.error('Error during decryption:', error);
        throw new Error('Decryption failed');
    }
};


const writeontag = async (req, res) => {
    const { tagId, phoneNumber, token } = req.body;

    if (!tagId || !phoneNumber || !token) {
        return res.status(400).json({ success: false, message: 'Tag ID and Phone Number and token are required.' });
    }

    if(token != 'top_secret') {
        return res.staus(402).json({success: false, message: 'Forbidden only admins have access'});
    }

    try {
        // Generate a 16-byte AES private key
        const privateKey = crypto.randomBytes(16).toString('hex');

        // Encrypt the phone number with the private key
        const encryptedPhoneNumber = encryptAES(phoneNumber, privateKey);

        // Combine tagId with the encrypted phone number
        const combinedString = `${tagId}#${encryptedPhoneNumber}`;

        // Encrypt the combined string with the global key
        const encryptedTagData = encryptAES(combinedString, GLOBAL_KEY);

        // Save Tag ID and private key in the Tag schema
        const newTag = new Tag({ tagId, privateKey });
        await newTag.save();

        // Respond with the encrypted data
        res.status(200).json({
            success: true,
            encryptedData: encryptedTagData,
            message: 'Data processed and encrypted successfully.',
        });
    } catch (error) {
        console.error('Error processing tag and phone number:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing tag and phone number.',
            error: error.message,
        });
    }
};

const validateTag = async (req, res) => {
    const { tid, encryptedData } = req.body;

    if (!encryptedData) {
        return res.status(400).json({ success: false, message: 'Encrypted data is required.' });
    }

    try {
        // Step 1: Decrypt the data using the GLOBAL_KEY
        const decryptedData = decryptAES(encryptedData, GLOBAL_KEY);

        // Step 2: Split the decrypted string by ':'
        const [tagId, encryptedPhoneNumber] = decryptedData.split('#');
        if (!tagId || !encryptedPhoneNumber) {
            return res.status(400).json({ success: false, message: 'Invalid data format.' });
        }

        // Step 3: Retrieve the private key associated with the tagId
        const tag = await Tag.findOne({ tagId });
        if (!tag) {
            return res.status(404).json({ success: false, message: 'Tag not found.' });
        }
        if(tid !== tagId) {
            return res.status(404).json({ success: false, message: 'Tag cloning suspect, auth failed' });
        }
        const privateKey = tag.privateKey;

        // Step 4: Decrypt the encrypted phone number using the private key
        const decryptedPhoneNumber = decryptAES(encryptedPhoneNumber, privateKey);
        console.log("decry phoe : " , decryptedPhoneNumber)

        // Step 5: Retrieve the user by the decrypted phone number
        const user = await User.findOne({ phoneNumber: decryptedPhoneNumber });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Step 6: Respond with the user's name
        res.status(200).json({
            success: true,
            name: user.name,
            message: 'User validated successfully.',
        });
    } catch (error) {
        console.error('Error validating tag:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing the request.',
            error: error.message,
        });
    }
};

module.exports = { addUser , writeontag , validateTag };
