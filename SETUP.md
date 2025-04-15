# 📱 Expensa

**Expensa** is a bare React Native mobile application built to help users manage their expenses efficiently and intuitively. This project is structured with scalability and ease of development in mind.

---

## 🚀 Features

- Add, edit, and delete expenses
- Categorize expenses
- View monthly summaries
- Fully native experience using React Native CLI

---

## 🛠️ Environment Setup

Before starting development, ensure your system has the required versions of these tools:

### ✅ Required Versions

| Tool                     | Version         | Check Command                         |
|--------------------------|------------------|----------------------------------------|
| Node.js                  | v18.20.8         | `node -v`                              |
| npm (comes with Node)    | ≥ 7              | `npm -v`                               |
| Java SDK                 | Java 20          | `java -version`                        |
| Android Debug Bridge     | v34.0.3          | `adb --version`                        |
| React Native CLI         | v15.0.1          | `npx react-native --version`          |

---

## ⚙️ Installation Instructions

Follow these steps to set up your development environment on **Windows** (similar for macOS/Linux with some changes):

### 1. **Install Node.js (includes npm)**

Download from [https://nodejs.org/](https://nodejs.org/en/download).  
Install the **LTS version** and restart your terminal.

### 2. **Install Java SDK**

You can install JDK via [Oracle’s site](https://www.oracle.com/java/technologies/javase/jdk20-archive-downloads.html) or use Chocolatey:

```bash
choco install openjdk
```

# Local Setup

### 1. Install dependencies
Using npm:

```bash
npm install
```

### 2. Start the Metro bundler
```bash
npx react-native start
```
Keep this terminal window running.

📱 Run on Android
### 3. Start an Android Emulator
1. Open Android Studio

2. Go to Device Manager

3. Start an existing virtual device
or
Connect a real Android device with USB debugging enabled

### 4. Run the app
Open a new terminal and run:

```bash
npx react-native run-android
```
✅ The app will compile and launch on the connected emulator or device.

## 🧪 Test your setup
If the app launches successfully, your local environment is ready to go!

Need help? Run:

```bash
npx react-native doctor
```
