import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

import doctorModel from "./models/doctorModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const doctors = [
    {
        name: "Dr. Richard James",
        speciality: "General physician",
        degree: "MBBS",
        experience: "4 Years",
        fees: 50,
        email: "doctor1@prescripto.com",
    },
    {
        name: "Dr. Emily Larson",
        speciality: "Gynecologist",
        degree: "MBBS",
        experience: "3 Years",
        fees: 60,
        email: "doctor2@prescripto.com",
    },
    {
        name: "Dr. Sarah Patel",
        speciality: "Dermatologist",
        degree: "MBBS",
        experience: "1 Years",
        fees: 30,
        email: "doctor3@prescripto.com",
    },
    {
        name: "Dr. Christopher Lee",
        speciality: "Pediatricians",
        degree: "MBBS",
        experience: "2 Years",
        fees: 40,
        email: "doctor4@prescripto.com",
    },
    {
        name: "Dr. Jennifer Garcia",
        speciality: "Neurologist",
        degree: "MBBS",
        experience: "4 Years",
        fees: 50,
        email: "doctor5@prescripto.com",
    },
    {
        name: "Dr. Andrew Williams",
        speciality: "Neurologist",
        degree: "MBBS",
        experience: "4 Years",
        fees: 50,
        email: "doctor6@prescripto.com",
    },
    {
        name: "Dr. Christopher Davis",
        speciality: "General physician",
        degree: "MBBS",
        experience: "4 Years",
        fees: 50,
        email: "doctor7@prescripto.com",
    },
    {
        name: "Dr. Timothy White",
        speciality: "Gynecologist",
        degree: "MBBS",
        experience: "3 Years",
        fees: 60,
        email: "doctor8@prescripto.com",
    },
    {
        name: "Dr. Ava Mitchell",
        speciality: "Dermatologist",
        degree: "MBBS",
        experience: "1 Years",
        fees: 30,
        email: "doctor9@prescripto.com",
    },
    {
        name: "Dr. Jeffrey King",
        speciality: "Pediatricians",
        degree: "MBBS",
        experience: "2 Years",
        fees: 40,
        email: "doctor10@prescripto.com",
    },
    {
        name: "Dr. Zoe Kelly",
        speciality: "Gastroenterologist",
        degree: "MBBS",
        experience: "4 Years",
        fees: 50,
        email: "doctor11@prescripto.com",
    },
    {
        name: "Dr. Patrick Harris",
        speciality: "Neurologist",
        degree: "MBBS",
        experience: "4 Years",
        fees: 50,
        email: "doctor12@prescripto.com",
    },
    {
        name: "Dr. Chloe Evans",
        speciality: "General physician",
        degree: "MBBS",
        experience: "4 Years",
        fees: 50,
        email: "doctor13@prescripto.com",
    },
    {
        name: "Dr. Ryan Martinez",
        speciality: "Gynecologist",
        degree: "MBBS",
        experience: "3 Years",
        fees: 60,
        email: "doctor14@prescripto.com",
    },
    {
        name: "Dr. Amelia Hill",
        speciality: "Dermatologist",
        degree: "MBBS",
        experience: "1 Years",
        fees: 30,
        email: "doctor15@prescripto.com",
    },
];

const seedDoctors = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);
        console.log("MongoDB connected");

        const hashedPassword = await bcrypt.hash("123456", 10);

        // frontend/src/assets ka path
        const imageFolder = path.join(
            __dirname,
            "../frontend/src/assets"
        );

        for (let i = 0; i < doctors.length; i++) {
            const doctor = doctors[i];

            const imagePath = path.join(
                imageFolder,
                `doc${i + 1}.png`
            );

            console.log(`Uploading doc${i + 1}.png...`);

            const uploadResult = await cloudinary.uploader.upload(
                imagePath,
                {
                    folder: "prescripto/doctors",
                    public_id: `doc${i + 1}`,
                    overwrite: true,
                }
            );

            const existingDoctor = await doctorModel.findOne({
                email: doctor.email,
            });

            if (existingDoctor) {
                console.log(
                    `${doctor.name} already exists. Skipping...`
                );
                continue;
            }

            await doctorModel.create({
                name: doctor.name,
                email: doctor.email,
                password: hashedPassword,
                image: uploadResult.secure_url,
                speciality: doctor.speciality,
                degree: doctor.degree,
                experience: doctor.experience,

                about:
                    "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",

                fees: doctor.fees,

                address: {
                    line1: "17th Cross, Richmond",
                    line2: "Circle, Ring Road, London",
                },

                date: Date.now(),

                available: true,

                slots_booked: {},
            });

            console.log(`✅ Added ${doctor.name}`);
        }

        console.log("🎉 All doctors seeded successfully!");

        await mongoose.connection.close();
    } catch (error) {
        console.error("❌ Seed error:", error);
        process.exit(1);
    }
};

seedDoctors();