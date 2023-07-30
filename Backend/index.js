import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import multer from "multer";
import cors from 'cors';

mongoose
  .connect("mongodb+srv://suchak:suchak1234@cluster0.43xtji3.mongodb.net/?retryWrites=true&w=majority", { dbName: "backenf" })
  .then(() => {
    console.log("cpnnected");
  })
  .catch((e) => {
    console.log(e);
  });
  const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ["m", "f", "o"], required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
   
    professionalSkills: {
      communication: { type: Boolean, default: false },
      criticalThinking: { type: Boolean, default: false },
      problemSolving: { type: Boolean, default: false },
      initiative: { type: Boolean, default: false },
    }
  });
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.set("view engine", "ejs");

const User = mongoose.model("User", UserSchema);

const photoSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
  uploadedAt: { type: Date, default: Date.now },
});
const Photo = mongoose.model("Photo", photoSchema);
// Handle the POST request to upload a photo
app.post("/photos", upload.single("photo"), async (req, res) => {
  try {
    const { filename, mimetype, buffer } = req.file;

    const photo = new Photo({
      filename,
      contentType: mimetype,
      data: buffer,
    });

    const savedPhoto = await photo.save();
    console.log("Photo uploaded successfully");
    res.json({ message: "Photo uploaded successfully" });
  } catch (error) {
    console.error("Failed to save the photo:", error);
    res.status(500).json({ error: "Failed to save the photo" });
  }
});
app.get("/photos", async (req, res) => {
  try {
    const photos = await Photo.find();
    res.json(photos);
  } catch (error) {
    console.error("Failed to retrieve photos:", error);
    res.status(500).json({ error: "Failed to retrieve photos" });
  }
});
app.get("/photos/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    res.set("Content-Type", photo.contentType);
    res.set("Content-Disposition", `attachment; filename=${photo.filename}`);
    res.send(photo.data);
  } catch (error) {
    console.error("Failed to retrieve photo:", error);
    res.status(500).json({ error: "Failed to retrieve photo" });
  }
});

app.get("/", (req, res) => {
  res.send("Sistem");
});

//register

app.post("/register", async (req, res) => {
  const { firstName, lastName, gender, email, phoneNumber, dateOfBirth, image, professionalSkills } = req.body;

  try {
    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send("User already registered");
    }

    // Create a new user instance using the User model and provided data
    const newUser = new User({
      firstName,
      lastName,
      gender,
      email,
      phoneNumber,
      dateOfBirth,
      image,
      professionalSkills,
    });

    // Save the user in the database
    await newUser.save();

    // Respond with a success message or any other response
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Failed to register user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

//logout
app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});
//getall users
app.get("/users", async (req, res) => {
  try {
    const allusers = await User.find({});
    res.json(allusers);
  } catch (err) {
    res.json({ err });
  }
});
app.listen(3000, () => {
  console.log("port 3000");
});
