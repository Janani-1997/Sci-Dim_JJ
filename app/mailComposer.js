var express=require('express');
var nodemailer = require("nodemailer");
var app=express();
const fse = require('fs-extra');

var smtpTransport = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secureConnection: false,
    tls: {
        ciphers:'SSLv3'
    },
    auth: {
        user: "sidharaj.s@spi-global.com",
        pass: "Global@123"
    }
});

sendexcelLogs = async(config) =>{
    return new Promise((resolve,reject)=>{
        smtpTransport.sendMail(config, function(error, response){
            if(error){
                   console.log(error);   
                   reject(error);    
            }else{
                /* console.log("Message sent: "); */
                resolve("Log file delivered successfully!!!");
            }
        });
    });
    
}


module.exports.sendLogs = sendexcelLogs;