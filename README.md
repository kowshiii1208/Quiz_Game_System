# 🚀 Professional C++ & OOP Quiz Game Management System

[![Language](https://img.shields.io/badge/Language-C%2B%2B14-blue.svg)](https://isocpp.org/)
[![Architecture](https://img.shields.io/badge/Architecture-Object--Oriented-green.svg)]()
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-orange.svg)]()

> A feature-rich, interactive, console-based assessment tool designed for evaluating Object-Oriented Programming (OOP) mastery in C++. Built with modular C++ class architecture, colorized ANSI CLI graphics, real-time timer analytics, leaderboard persistence, and automatic printable certificate generation.

---

## 🌟 Key Features

- 👤 **Student Registration & Session Tracking**:
  - Captures student profile details (Full Name, Roll Number / Student ID).
  - Configurable difficulty level selection: **Easy**, **Medium**, **Hard**, or **Mixed**.

- 📚 **Comprehensive C++ & OOP Question Bank**:
  - 100% Multiple Choice Questions (MCQs) focusing on core & advanced C++ OOP principles:
    - **Encapsulation & Access Specifiers** (`public`, `private`, `protected`).
    - **Inheritance & Constructors/Destructors** (Base/Derived lifetime, virtual destructors).
    - **Polymorphism** (Function overloading, operator overloading, virtual functions, VTABLE mechanics).
    - **Abstraction** (Pure virtual functions, Abstract Base Classes).
    - **Advanced Concepts** (Friend functions, Diamond Problem, Object Slicing, RAII, Smart Pointers).

- ⚡ **Interactive CLI & Visual Feedback**:
  - ANSI colored terminal user interface with clear visual hierarchy.
  - Live progress bars `[████████░░] 80%` and timer countdowns.
  - Instant grading feedback with deep conceptual explanations for every question.

- 📊 **Comprehensive Result Scorecard & Analytics**:
  - Displays total score, accuracy percentage, time taken, and wrong answer metrics.
  - Dynamically awards **Honors Badges**:
    - 🏆 `C++ OOP MASTER (OUTSTANDING)` (Score ≥ 90%)
    - ⭐ `ADVANCED C++ DEVELOPER (VERY GOOD)` (Score ≥ 70%)
    - 👍 `COMPETENT DEVELOPER (GOOD PASS)` (Score ≥ 50%)
    - 📚 `C++ APPRENTICE (NEEDS REVISION)` (Score < 50%)
  - Itemized Question-by-Question Review table with detailed learning notes.

- 🏆 **Leaderboard & Persistence Engine**:
  - Automatically saves student assessment records to disk (`leaderboard.txt`).
  - View top student rankings sorted by percentage score and speed in the **Hall of Fame**.

- 📜 **Printable Certificate Generator**:
  - Option to automatically generate a formatted text certificate file (`Certificate_<RollNo>.txt`) upon assessment completion.

---

## 🏗️ System Architecture & Object-Oriented Design (OOP)

The application adheres to clean C++ Object-Oriented Design patterns:

```
+-----------------------------------------------------------------------------------+
|                                  MAIN MENU                                        |
+-----------------------------------------------------------------------------------+
                                      |
       +------------------------------+------------------------------+
       |                              |                              |
       v                              v                              v
[QuizEngine]                 [LeaderboardManager]                [UI / Input]
       |                              |                              |
  +----+----+                         v                              v
  |         |                  Reads/Writes                     Terminal Helpers,
  v         v                 leaderboard.txt                   Color Palette &
[Student] [QuestionBank]                                        Input Sanitization
  |         |
  +----+----+
       |
       v
[ResultCard] ===> Generates Printable Certificate File (Certificate_<RollNo>.txt)
```

### Core Classes & Responsibilities

1. **`Student`**
   - **Encapsulation**: Manages student demographics (`name`, `rollNumber`, `chosenDifficulty`) using private member attributes with public accessor methods.

2. **`Question`**
   - Encapsulates question text, 4 multiple-choice options (`A`, `B`, `C`, `D`), correct option index, difficulty level, topic tag, and educational explanation.
   - Provides methods for grading student choices (`checkAnswer()`) and rendering formatted questions (`display()`).

3. **`QuestionBank`**
   - Serves as the central repository of C++ & OOP questions categorized into Easy, Medium, and Hard tiers.
   - Uses `std::mt19937` pseudo-random generator to shuffle questions and options for each assessment run.

4. **`QuizEngine`**
   - Controller class that manages assessment execution, timer calculations, live progress rendering, and user input validation.

5. **`ResultCard` & `LeaderboardManager`**
   - Formats student performance metrics, generates grade badges, handles file persistence (`leaderboard.txt`), and exports printable text certificates.

6. **`UI` & `Input`**
   - Utility namespaces providing cross-platform ANSI color palettes, screen clearing, input sanitization, menu bounds checking, and progress bar visualization.

---

## 🛠️ Compilation & Execution

### Prerequisites
- Any modern C++ compiler supporting **C++14** or later (MinGW `g++`, MSVC `cl.exe`, or `clang++`).

### Building on Windows / Linux / macOS

1. **Clone or Open the Project Directory**:
   ```bash
   cd c:/Users/kowsh/OneDrive/Desktop/cpp_project
   ```

2. **Compile using GCC / MinGW (`g++`)**:
   ```bash
   g++ -std=c++14 -O2 main.cpp -o quiz_game.exe
   ```

3. **Run the Application**:
   - **Windows**:
     ```cmd
     quiz_game.exe
     ```
   - **Linux / macOS**:
     ```bash
     ./quiz_game.exe
     ```

---

## 📖 User Walkthrough

1. **Welcome Screen**:
   - Launch the application to view the C++ & OOP ASCII banner and main menu.
2. **Details & Difficulty Selection**:
   - Option `[1]` to start a new assessment.
   - Enter your **Full Name** and **Roll Number / Student ID**.
   - Select assessment difficulty: `[1] Easy`, `[2] Medium`, `[3] Hard`, or `[4] Mixed`.
3. **Taking the Quiz**:
   - Answer each multiple choice question by entering `A`, `B`, `C`, or `D`.
   - Receive instant answer verification and explanation after each question.
4. **Scorecard & Certificate**:
   - Review your final score percentage, time taken, accuracy, and grade badge.
   - View the detailed explanation breakdown for any missed questions.
   - Enter `Y` when prompted to generate your personalized printable `Certificate_<RollNo>.txt`.
5. **Leaderboard**:
   - Option `[2]` from the main menu to view the global Hall of Fame high scores.

---

## 📁 File Structure

```
cpp_project/
├── main.cpp             # Complete C++ source code with full OOP implementation
├── README.md            # Comprehensive project documentation
├── leaderboard.txt      # Auto-generated database file storing high scores
└── Certificate_*.txt    # Auto-generated printable student certificates
```

---

## 📄 License & Credits

Designed & Developed as an Exemplary C++ Object-Oriented Programming (OOP) Assessment Project.
