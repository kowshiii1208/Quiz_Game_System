#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <chrono>
#include <thread>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <cctype>
#include <ctime>
#include <cstdlib>
#include <random>

#ifdef _WIN32
#include <windows.h>
#ifndef ENABLE_VIRTUAL_TERMINAL_PROCESSING
#define ENABLE_VIRTUAL_TERMINAL_PROCESSING 0x0004
#endif
#endif

// ============================================================================
// WINDOWS TERMINAL VT100 / ANSI INITIALIZER
// ============================================================================
void initTerminal() {
#ifdef _WIN32
    // Enable ANSI Escape Codes & UTF-8 Code Page in Windows Console
    HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
    if (hOut != INVALID_HANDLE_VALUE) {
        DWORD dwMode = 0;
        if (GetConsoleMode(hOut, &dwMode)) {
            dwMode |= ENABLE_VIRTUAL_TERMINAL_PROCESSING;
            SetConsoleMode(hOut, dwMode);
        }
    }
    SetConsoleOutputCP(65001); // Set UTF-8
#endif
}

// ============================================================================
// ANSI COLOR PALETTE
// ============================================================================
namespace Colors {
    const std::string RESET     = "\033[0m";
    const std::string BOLD      = "\033[1m";
    const std::string DIM       = "\033[2m";

    const std::string RED       = "\033[31m";
    const std::string GREEN     = "\033[32m";
    const std::string YELLOW    = "\033[33m";
    const std::string BLUE      = "\033[34m";
    const std::string MAGENTA   = "\033[35m";
    const std::string CYAN      = "\033[36m";
    const std::string WHITE     = "\033[37m";

    const std::string B_RED     = "\033[91m";
    const std::string B_GREEN   = "\033[92m";
    const std::string B_YELLOW  = "\033[93m";
    const std::string B_BLUE    = "\033[94m";
    const std::string B_MAGENTA = "\033[95m";
    const std::string B_CYAN    = "\033[96m";
    const std::string B_WHITE   = "\033[97m";
}

// ============================================================================
// UI & INPUT UTILITIES
// ============================================================================
class UI {
public:
    static void clearScreen() {
#ifdef _WIN32
        std::system("cls");
#else
        std::system("clear");
#endif
    }

    static void pause(int milliseconds = 800) {
#ifdef _WIN32
        Sleep(milliseconds);
#else
        std::this_thread::sleep_for(std::chrono::milliseconds(milliseconds));
#endif
    }

    static void pressEnterToContinue() {
        std::cout << "\n  " << Colors::DIM << Colors::B_WHITE << "Press ENTER to continue..." << Colors::RESET;
        std::cin.ignore(10000, '\n');
    }

    static void printHeader(const std::string& title) {
        clearScreen();
        std::cout << Colors::B_CYAN << "================================================================================\n";
        std::cout << "  " << Colors::BOLD << Colors::B_YELLOW << title << Colors::RESET << Colors::B_CYAN << "\n";
        std::cout << "================================================================================\n" << Colors::RESET << "\n";
    }

    static void printDivider(char ch = '=', int length = 80) {
        std::cout << Colors::B_CYAN << std::string(length, ch) << Colors::RESET << "\n";
    }

    static std::string getCurrentTimestamp() {
        std::time_t now = std::time(nullptr);
        char buf[80];
        std::strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", std::localtime(&now));
        return std::string(buf);
    }
};

class Input {
public:
    static std::string getString(const std::string& prompt) {
        std::string val;
        while (true) {
            std::cout << prompt;
            std::getline(std::cin, val);
            size_t first = val.find_first_not_of(" \t\r\n");
            if (first == std::string::npos) {
                std::cout << Colors::B_RED << "  [!] Input cannot be empty. Please try again.\n" << Colors::RESET;
                continue;
            }
            size_t last = val.find_last_not_of(" \t\r\n");
            return val.substr(first, (last - first + 1));
        }
    }

    static char getOptionChoice(const std::string& prompt) {
        while (true) {
            std::string input = getString(prompt);
            if (input.length() == 1) {
                char choice = static_cast<char>(std::toupper(input[0]));
                if (choice >= 'A' && choice <= 'D') {
                    return choice;
                }
            }
            std::cout << Colors::B_RED << "  [!] Invalid choice! Please enter A, B, C, or D.\n" << Colors::RESET;
        }
    }

    static int getMenuChoice(int minVal, int maxVal, const std::string& prompt) {
        while (true) {
            std::string input = getString(prompt);
            try {
                int val = std::stoi(input);
                if (val >= minVal && val <= maxVal) {
                    return val;
                }
            } catch (...) {}
            std::cout << Colors::B_RED << "  [!] Invalid selection! Please enter a number between " 
                      << minVal << " and " << maxVal << ".\n" << Colors::RESET;
        }
    }
};

// ============================================================================
// DOMAIN MODELS & OBJECT-ORIENTED DESIGN (OOP)
// ============================================================================

enum class Difficulty { EASY, MEDIUM, HARD, MIXED };

std::string difficultyToString(Difficulty diff) {
    switch (diff) {
        case Difficulty::EASY:   return "EASY";
        case Difficulty::MEDIUM: return "MEDIUM";
        case Difficulty::HARD:   return "HARD";
        default:                 return "MIXED";
    }
}

// ----------------------------------------------------------------------------
// Class: Question
// ----------------------------------------------------------------------------
class Question {
private:
    int id;
    std::string text;
    std::vector<std::string> options; // Exactly 4 options A, B, C, D
    int correctOptionIndex;           // 0 for A, 1 for B, 2 for C, 3 for D
    Difficulty difficulty;
    std::string topic;
    std::string explanation;

public:
    Question() : id(0), text(""), correctOptionIndex(0), difficulty(Difficulty::EASY), topic(""), explanation("") {}

    Question(int id, std::string text, std::vector<std::string> options, 
             int correctIndex, Difficulty diff, std::string topic, std::string explanation)
        : id(id), text(text), options(options), correctOptionIndex(correctIndex),
          difficulty(diff), topic(topic), explanation(explanation) {}

    int getId() const { return id; }
    std::string getText() const { return text; }
    std::vector<std::string> getOptions() const { return options; }
    int getCorrectOptionIndex() const { return correctOptionIndex; }
    char getCorrectOptionLetter() const { return 'A' + correctOptionIndex; }
    Difficulty getDifficulty() const { return difficulty; }
    std::string getTopic() const { return topic; }
    std::string getExplanation() const { return explanation; }

    bool checkAnswer(char userLetter) const {
        int userIndex = std::toupper(userLetter) - 'A';
        return userIndex == correctOptionIndex;
    }

    void display(int questionNum, int totalQuestions) const {
        std::cout << Colors::B_CYAN << "--------------------------------------------------------------------------------\n";
        std::cout << Colors::B_YELLOW << " QUESTION " << questionNum << " OF " << totalQuestions 
                  << Colors::RESET << Colors::CYAN << "  [LEVEL: " << difficultyToString(difficulty) 
                  << " | TOPIC: " << topic << "]\n";
        std::cout << Colors::B_CYAN << "--------------------------------------------------------------------------------\n" << Colors::RESET;
        
        std::cout << Colors::BOLD << Colors::B_WHITE << text << Colors::RESET << "\n\n";

        char optionLetter = 'A';
        for (const auto& opt : options) {
            std::cout << "   " << Colors::B_CYAN << "[" << optionLetter << "] " 
                      << Colors::RESET << opt << "\n";
            optionLetter++;
        }
        std::cout << "\n";
    }
};

// ----------------------------------------------------------------------------
// Class: Student
// ----------------------------------------------------------------------------
class Student {
private:
    std::string name;
    std::string rollNumber;
    Difficulty chosenDifficulty;

public:
    Student() : name(""), rollNumber(""), chosenDifficulty(Difficulty::EASY) {}
    Student(std::string name, std::string rollNum, Difficulty diff)
        : name(name), rollNumber(rollNum), chosenDifficulty(diff) {}

    std::string getName() const { return name; }
    std::string getRollNumber() const { return rollNumber; }
    Difficulty getChosenDifficulty() const { return chosenDifficulty; }

    void setDetails(std::string n, std::string r, Difficulty d) {
        name = n;
        rollNumber = r;
        chosenDifficulty = d;
    }
};

// ----------------------------------------------------------------------------
// Struct: QuestionResult
// ----------------------------------------------------------------------------
struct QuestionResult {
    Question question;
    char userChoice;
    bool isCorrect;
    double timeTakenSeconds;
};

// ----------------------------------------------------------------------------
// Class: QuizRecord (Leaderboard Model)
// ----------------------------------------------------------------------------
class QuizRecord {
public:
    std::string name;
    std::string rollNumber;
    std::string difficulty;
    int score;
    int totalQuestions;
    double percentage;
    double timeTakenSec;
    std::string timestamp;

    std::string serialize() const {
        std::ostringstream oss;
        oss << name << "|" << rollNumber << "|" << difficulty << "|" 
            << score << "|" << totalQuestions << "|" << std::fixed << std::setprecision(1) 
            << percentage << "|" << timeTakenSec << "|" << timestamp;
        return oss.str();
    }

    static QuizRecord deserialize(const std::string& line) {
        QuizRecord r;
        std::stringstream ss(line);
        std::string token;
        std::vector<std::string> tokens;
        while (std::getline(ss, token, '|')) {
            tokens.push_back(token);
        }
        if (tokens.size() >= 8) {
            r.name = tokens[0];
            r.rollNumber = tokens[1];
            r.difficulty = tokens[2];
            r.score = std::stoi(tokens[3]);
            r.totalQuestions = std::stoi(tokens[4]);
            r.percentage = std::stod(tokens[5]);
            r.timeTakenSec = std::stod(tokens[6]);
            r.timestamp = tokens[7];
        }
        return r;
    }
};

// ============================================================================
// QUESTION BANK (100% C++ & OOP FOCUSED MCQs)
// ============================================================================
class QuestionBank {
private:
    std::vector<Question> questions;

public:
    QuestionBank() {
        seedQuestions();
    }

    void seedQuestions() {
        // --- EASY LEVEL QUESTIONS ---
        questions.emplace_back(
            1,
            "Which pillar of OOP binds data and functions together into a single unit?",
            std::vector<std::string>{"Inheritance", "Encapsulation", "Polymorphism", "Abstraction"},
            1, Difficulty::EASY, "Encapsulation",
            "Encapsulation wraps data members and methods inside a class to restrict direct outside access."
        );

        questions.emplace_back(
            2,
            "What is the default access specifier for members of a class in C++?",
            std::vector<std::string>{"public", "protected", "private", "internal"},
            2, Difficulty::EASY, "Access Specifiers",
            "In C++, class members are private by default, whereas struct members are public by default."
        );

        questions.emplace_back(
            3,
            "Which keyword is used to inherit a class in C++?",
            std::vector<std::string>{"extends", "implements", ": (colon with access specifier)", "super"},
            2, Difficulty::EASY, "Inheritance Syntax",
            "Inheritance in C++ uses a colon after the derived class name, e.g., 'class Derived : public Base'."
        );

        questions.emplace_back(
            4,
            "What special member function is automatically executed when an object is created?",
            std::vector<std::string>{"Destructor", "Constructor", "Virtual Function", "Friend Function"},
            1, Difficulty::EASY, "Constructors",
            "Constructors initialize objects when instantiated and share the exact name of the class."
        );

        questions.emplace_back(
            5,
            "Which operator is used to allocate memory dynamically on the heap in C++?",
            std::vector<std::string>{"malloc", "alloc", "new", "create"},
            2, Difficulty::EASY, "Dynamic Memory",
            "The 'new' operator allocates memory on the heap and calls the object constructor."
        );

        questions.emplace_back(
            6,
            "What is the return type of a constructor in C++?",
            std::vector<std::string>{"void", "int", "pointer to class", "No return type"},
            3, Difficulty::EASY, "Constructors",
            "Constructors do not have any return type, not even void."
        );

        questions.emplace_back(
            7,
            "What is a member function that has the same name as the class preceded by a tilde (~)?",
            std::vector<std::string>{"Copy Constructor", "Destructor", "Virtual Method", "Operator Function"},
            1, Difficulty::EASY, "Destructors",
            "A destructor (~ClassName) cleans up resources when an object is destroyed."
        );

        questions.emplace_back(
            8,
            "Which access specifier allows members to be accessed by derived classes but NOT outside the class?",
            std::vector<std::string>{"public", "protected", "private", "default"},
            1, Difficulty::EASY, "Access Control",
            "'protected' members are accessible within the class and its derived classes, but private to external code."
        );

        questions.emplace_back(
            9,
            "Which keyword is used to define generic classes and functions in C++?",
            std::vector<std::string>{"generic", "template", "type", "concept"},
            1, Difficulty::EASY, "Templates",
            "The 'template' keyword enables writing generic type-independent C++ code."
        );

        questions.emplace_back(
            10,
            "Which pointer implicitly points to the calling object inside a class member function?",
            std::vector<std::string>{"self", "this", "base", "ptr"},
            1, Difficulty::EASY, "This Pointer",
            "'this' is a constant pointer available inside non-static member functions pointing to the invoking object."
        );

        // --- MEDIUM LEVEL QUESTIONS ---
        questions.emplace_back(
            11,
            "Function Overloading and Operator Overloading are examples of what type of polymorphism?",
            std::vector<std::string>{"Runtime Polymorphism", "Compile-Time Polymorphism", "Dynamic Binding", "Deferred Binding"},
            1, Difficulty::MEDIUM, "Polymorphism",
            "Overloading is resolved during compilation, making it static or compile-time polymorphism."
        );

        questions.emplace_back(
            12,
            "Which keyword enables dynamic binding (runtime polymorphism) in C++?",
            std::vector<std::string>{"dynamic", "override", "virtual", "inline"},
            2, Difficulty::MEDIUM, "Virtual Functions",
            "Declaring a method as 'virtual' tells the compiler to perform dynamic dispatch at runtime."
        );

        questions.emplace_back(
            13,
            "A class containing at least one pure virtual function (= 0) is called what?",
            std::vector<std::string>{"Concrete Class", "Abstract Base Class", "Interface Class", "Final Class"},
            1, Difficulty::MEDIUM, "Abstraction",
            "Classes with at least one pure virtual function cannot be instantiated and are called Abstract Base Classes."
        );

        questions.emplace_back(
            14,
            "Which non-member function can access private and protected members of a class?",
            std::vector<std::string>{"Inline Function", "Friend Function", "Static Function", "Virtual Function"},
            1, Difficulty::MEDIUM, "Friendship",
            "A 'friend' function declared inside a class is granted access to its private and protected members."
        );

        questions.emplace_back(
            15,
            "In C++ object inheritance, in what order are constructors executed?",
            std::vector<std::string>{
                "Derived Class Constructor first, then Base Class",
                "Base Class Constructor first, then Derived Class",
                "Constructors run in arbitrary order",
                "Only Derived Class Constructor is called"
            },
            1, Difficulty::MEDIUM, "Constructor Order",
            "Base class constructors execute first to build the base foundation, followed by derived class constructors."
        );

        questions.emplace_back(
            16,
            "What is the correct syntax for declaring a pure virtual function in C++?",
            std::vector<std::string>{
                "virtual void display() = null;",
                "virtual void display() = 0;",
                "pure virtual void display();",
                "virtual void display() abstract;"
            },
            1, Difficulty::MEDIUM, "Pure Virtual Functions",
            "Setting a virtual function declaration to '= 0;' specifies it as pure virtual."
        );

        questions.emplace_back(
            17,
            "Which C++ cast operator is specifically used for safe downcasting in polymorphic inheritance hierarchies?",
            std::vector<std::string>{"static_cast", "const_cast", "dynamic_cast", "reinterpret_cast"},
            2, Difficulty::MEDIUM, "RTTI & Casting",
            "dynamic_cast checks type safety at runtime using RTTI when downcasting pointers/references."
        );

        questions.emplace_back(
            18,
            "What does declaring a single-argument constructor with the 'explicit' keyword prevent?",
            std::vector<std::string>{
                "Object instantiation",
                "Implicit type conversions",
                "Inheritance by derived classes",
                "Destructor invocation"
            },
            1, Difficulty::MEDIUM, "Explicit Keyword",
            "'explicit' prevents the compiler from using the constructor for implicit type conversion during assignment."
        );

        questions.emplace_back(
            19,
            "Which C++ operator CANNOT be overloaded?",
            std::vector<std::string>{"+ (addition)", ":: (scope resolution)", "== (equality)", "[] (subscript)"},
            1, Difficulty::MEDIUM, "Operator Overloading",
            "Operators like :: (scope resolution), . (member selection), and sizeof cannot be overloaded in C++."
        );

        questions.emplace_back(
            20,
            "What is a Copy Constructor signature for a class named 'Student'?",
            std::vector<std::string>{
                "Student(Student obj);",
                "Student(const Student& obj);",
                "Student(Student* obj);",
                "void Student(Student& obj);"
            },
            1, Difficulty::MEDIUM, "Copy Constructor",
            "A copy constructor takes a reference to const object (const Student& obj) to avoid infinite recursion."
        );

        // --- HARD LEVEL QUESTIONS ---
        questions.emplace_back(
            21,
            "Why should a Base class destructor always be declared as 'virtual' when derived classes are deleted via base pointers?",
            std::vector<std::string>{
                "To prevent compilation errors",
                "To ensure the Derived class destructor is invoked to prevent memory leaks",
                "To speed up execution",
                "To make destructors public"
            },
            1, Difficulty::HARD, "Virtual Destructors",
            "If a base destructor is not virtual, deleting a derived object via a base pointer causes Undefined Behavior & leaks."
        );

        questions.emplace_back(
            22,
            "What ambiguity problem arises when a class inherits from two classes that derive from a common base class?",
            std::vector<std::string>{"Slicing Problem", "Diamond Problem", "Dangling Reference", "Shadowing Problem"},
            1, Difficulty::HARD, "Multiple Inheritance",
            "The Diamond Problem causes duplicate sub-objects of the grandparent class to exist in the derived object."
        );

        questions.emplace_back(
            23,
            "How is the Diamond Problem resolved in C++ multiple inheritance?",
            std::vector<std::string>{
                "By using friend classes",
                "By using virtual base class (virtual inheritance)",
                "By using static methods",
                "By using private inheritance"
            },
            1, Difficulty::HARD, "Virtual Inheritance",
            "Inheriting base classes with 'virtual' (e.g. class B : virtual public A) ensures only one shared base instance exists."
        );

        questions.emplace_back(
            24,
            "What is Object Slicing in C++?",
            std::vector<std::string>{
                "Assigning a derived object to a base object by value, stripping derived members",
                "Splitting an array of objects into chunks",
                "Deleting part of an object from memory",
                "Converting a class into a struct"
            },
            0, Difficulty::HARD, "Object Slicing",
            "When assigning a derived instance to a base instance by value, derived attributes & virtual pointers are sliced off."
        );

        questions.emplace_back(
            25,
            "What internal lookup structure does the C++ compiler build per class to support virtual function dispatch?",
            std::vector<std::string>{"VTABLE (Virtual Table)", "Stack Frame", "Symbol Map", "Heap Registry"},
            0, Difficulty::HARD, "VTABLE & VPTR",
            "The compiler constructs a VTABLE containing pointers to virtual functions for runtime dynamic resolution."
        );

        questions.emplace_back(
            26,
            "Which smart pointer provides exclusive non-shareable ownership of dynamic memory?",
            std::vector<std::string>{"std::shared_ptr", "std::weak_ptr", "std::unique_ptr", "std::auto_ptr"},
            2, Difficulty::HARD, "RAII & Smart Pointers",
            "std::unique_ptr owns a resource exclusively and cannot be copied (only moved)."
        );

        questions.emplace_back(
            27,
            "What core programming idiom binds resource lifecycle to object lifespan in C++?",
            std::vector<std::string>{"RTTI", "RAII (Resource Acquisition Is Initialization)", "CRTP", "SFINAE"},
            1, Difficulty::HARD, "RAII",
            "RAII ensures resources (memory, file handles, locks) are acquired in constructors and freed in destructors."
        );

        questions.emplace_back(
            28,
            "What does the C++11 'override' specifier enforce at compile-time?",
            std::vector<std::string>{
                "Forces a function to be inline",
                "Ensures the member function correctly overrides a virtual function in a base class",
                "Prevents function modification",
                "Disables virtual dispatch"
            },
            1, Difficulty::HARD, "Override Specifier",
            "'override' causes a compilation error if the function signature does not match any virtual function in the base class."
        );

        questions.emplace_back(
            29,
            "What happens if an unhandled exception is thrown inside a destructor during stack unwinding?",
            std::vector<std::string>{
                "The exception is ignored",
                "std::terminate() is called, terminating the program",
                "The program restarts",
                "The destructor is retried"
            },
            1, Difficulty::HARD, "Exceptions & Destructors",
            "Throwing exceptions from destructors during stack unwinding results in two active exceptions, calling std::terminate()."
        );

        questions.emplace_back(
            30,
            "What is the size of an empty class in C++?",
            std::vector<std::string>{"0 bytes", "1 byte (or non-zero)", "4 bytes", "8 bytes"},
            1, Difficulty::HARD, "Object Layout",
            "To ensure distinct memory addresses for different object instances, an empty class has a non-zero size (typically 1 byte)."
        );
    }

    std::vector<Question> getQuestionsForQuiz(Difficulty diff, int count = 10) {
        std::vector<Question> pool;
        for (const auto& q : questions) {
            if (diff == Difficulty::MIXED || q.getDifficulty() == diff) {
                pool.push_back(q);
            }
        }

        // Shuffle questions
        unsigned seed = static_cast<unsigned>(std::chrono::system_clock::now().time_since_epoch().count());
        std::mt19937 rng(seed);
        std::shuffle(pool.begin(), pool.end(), rng);

        if (pool.size() > static_cast<size_t>(count)) {
            pool.resize(count);
        }
        return pool;
    }
};

// ============================================================================
// LEADERBOARD & CERTIFICATE FILE PERSISTENCE
// ============================================================================
class StorageManager {
public:
    static void saveScore(const Student& s, int score, int total, double percentage, double timeSec) {
        std::ofstream outFile("leaderboard.txt", std::ios::app);
        if (outFile.is_open()) {
            outFile << s.getName() << "|" << s.getRollNumber() << "|" 
                    << difficultyToString(s.getChosenDifficulty()) << "|" 
                    << score << "|" << total << "|" 
                    << std::fixed << std::setprecision(1) << percentage << "|" 
                    << std::fixed << std::setprecision(1) << timeSec << "|" 
                    << UI::getCurrentTimestamp() << "\n";
            outFile.close();
        }
    }

    static std::vector<QuizRecord> getTopRecords(size_t limit = 10) {
        std::vector<QuizRecord> records;
        std::ifstream inFile("leaderboard.txt");
        if (!inFile.is_open()) return records;

        std::string line;
        while (std::getline(inFile, line)) {
            if (!line.empty()) {
                records.push_back(QuizRecord::deserialize(line));
            }
        }
        inFile.close();

        std::sort(records.begin(), records.end(), [](const QuizRecord& a, const QuizRecord& b) {
            if (a.percentage != b.percentage) return a.percentage > b.percentage;
            return a.timeTakenSec < b.timeTakenSec;
        });

        if (records.size() > limit) {
            records.resize(limit);
        }
        return records;
    }

    static void displayLeaderboard() {
        UI::printHeader("LEADERBOARD - HALL OF FAME");
        auto records = getTopRecords(10);

        if (records.empty()) {
            std::cout << Colors::B_YELLOW << "  [i] No quiz records found yet! Play a quiz to enter the Hall of Fame.\n" << Colors::RESET;
        } else {
            std::cout << Colors::B_CYAN 
                      << std::left << std::setw(6)  << "RANK"
                      << std::left << std::setw(20) << "NAME"
                      << std::left << std::setw(15) << "ROLL NO"
                      << std::left << std::setw(12) << "LEVEL"
                      << std::left << std::setw(10) << "SCORE"
                      << std::left << std::setw(12) << "ACCURACY"
                      << std::left << std::setw(12) << "TIME (s)"
                      << "\n";
            UI::printDivider('=', 88);

            int rank = 1;
            for (const auto& r : records) {
                std::string medal = (rank == 1) ? "🥇 " : (rank == 2) ? "🥈 " : (rank == 3) ? "🥉 " : "   ";
                std::cout << Colors::B_WHITE << medal << std::left << std::setw(4) << rank
                          << Colors::B_YELLOW << std::left << std::setw(20) << (r.name.length() > 18 ? r.name.substr(0, 15) + "..." : r.name)
                          << Colors::B_CYAN   << std::left << std::setw(15) << r.rollNumber
                          << Colors::WHITE    << std::left << std::setw(12) << r.difficulty
                          << Colors::B_GREEN  << std::left << std::setw(10) << (std::to_string(r.score) + "/" + std::to_string(r.totalQuestions))
                          << Colors::B_MAGENTA<< std::left << std::setw(12) << (std::to_string(static_cast<int>(r.percentage)) + "%")
                          << Colors::B_WHITE  << std::left << std::setw(12) << std::fixed << std::setprecision(1) << r.timeTakenSec
                          << Colors::RESET << "\n";
                rank++;
            }
        }
        std::cout << "\n";
        UI::pressEnterToContinue();
    }

    static void generateCertificate(const Student& student, int score, int total, double percentage, double timeSec) {
        std::string filename = "Certificate_" + student.getRollNumber() + ".txt";
        std::ofstream certFile(filename);
        if (certFile.is_open()) {
            certFile << "================================================================================\n";
            certFile << "                        CERTIFICATE OF ACHIEVEMENT                              \n";
            certFile << "                 C++ OBJECT-ORIENTED PROGRAMMING ASSESSMENT                     \n";
            certFile << "================================================================================\n\n";
            certFile << "  This is to certify that:\n\n";
            certFile << "       STUDENT NAME : " << student.getName() << "\n";
            certFile << "       ROLL NUMBER  : " << student.getRollNumber() << "\n";
            certFile << "       DIFFICULTY   : " << difficultyToString(student.getChosenDifficulty()) << "\n\n";
            certFile << "  has successfully completed the C++ OOP Assessment with the following results:\n\n";
            certFile << "       FINAL SCORE  : " << score << " / " << total << " (" << std::fixed << std::setprecision(1) << percentage << "%)\n";
            certFile << "       TIME TAKEN   : " << std::fixed << std::setprecision(1) << timeSec << " Seconds\n";
            certFile << "       DATE & TIME  : " << UI::getCurrentTimestamp() << "\n\n";
            certFile << "--------------------------------------------------------------------------------\n";
            certFile << "  Verified by C++ Quiz Game Management System Engine.\n";
            certFile << "================================================================================\n";
            certFile.close();

            std::cout << Colors::B_GREEN << "  [+] Certificate saved successfully to '" << filename << "'!\n" << Colors::RESET;
        }
    }
};

// ============================================================================
// RESULT CARD RENDERER
// ============================================================================
class ResultCard {
public:
    static void render(const Student& student, const std::vector<QuestionResult>& results, double totalTimeSec) {
        int correctCount = 0;
        int totalQuestions = static_cast<int>(results.size());
        for (const auto& r : results) {
            if (r.isCorrect) correctCount++;
        }

        double percentage = (totalQuestions > 0) ? (static_cast<double>(correctCount) / totalQuestions) * 100.0 : 0.0;

        UI::clearScreen();

        // --------------------------------------------------------------------
        // EXACT RESULT CARD FORMATTING
        // --------------------------------------------------------------------
        std::cout << Colors::B_CYAN << "================================================================================\n";
        std::cout << "                                 " << Colors::BOLD << Colors::B_YELLOW << "RESULT CARD" << Colors::RESET << Colors::B_CYAN << "\n";
        std::cout << "================================================================================\n" << Colors::RESET;

        std::cout << "  " << Colors::BOLD << Colors::WHITE << "NAME  : " << Colors::B_YELLOW << student.getName() << Colors::RESET << "\n";
        std::cout << "  " << Colors::BOLD << Colors::WHITE << "ROLL  : " << Colors::B_CYAN   << student.getRollNumber() << Colors::RESET << "\n";
        std::cout << "  " << Colors::BOLD << Colors::WHITE << "LEVEL : " << Colors::B_MAGENTA<< difficultyToString(student.getChosenDifficulty()) << Colors::RESET << "\n";
        
        // Score display: e.g. SCORE : 09/10 (90.0%)
        std::string scoreStr = (correctCount < 10 ? "0" : "") + std::to_string(correctCount) + "/" + std::to_string(totalQuestions);
        std::cout << "  " << Colors::BOLD << Colors::WHITE << "SCORE : " << Colors::B_GREEN  << scoreStr 
                  << Colors::B_YELLOW << "  (" << std::fixed << std::setprecision(1) << percentage << "%)" << Colors::RESET << "\n";
        std::cout << "  " << Colors::BOLD << Colors::WHITE << "TIME  : " << Colors::B_CYAN   << std::fixed << std::setprecision(1) << totalTimeSec << " Seconds" << Colors::RESET << "\n";
        
        std::cout << Colors::B_CYAN << "================================================================================\n\n" << Colors::RESET;

        // Performance Grade Badge
        std::string badge;
        std::string badgeColor;
        if (percentage >= 90.0) {
            badge = "🏆 C++ OOP MASTER (OUTSTANDING PERFORMANCE)";
            badgeColor = Colors::B_GREEN;
        } else if (percentage >= 70.0) {
            badge = "⭐ ADVANCED C++ DEVELOPER (EXCELLENT PASS)";
            badgeColor = Colors::B_CYAN;
        } else if (percentage >= 50.0) {
            badge = "👍 COMPETENT DEVELOPER (GOOD PASS)";
            badgeColor = Colors::B_YELLOW;
        } else {
            badge = "📚 C++ APPRENTICE (NEEDS REVISION)";
            badgeColor = Colors::B_RED;
        }

        std::cout << "  " << Colors::BOLD << Colors::WHITE << "PERFORMANCE BADGE: " << badgeColor << badge << Colors::RESET << "\n\n";

        // Detailed Question Review Table
        std::cout << Colors::BOLD << Colors::B_YELLOW << "DETAILED QUESTION REVIEW & CONCEPT EXPLANATIONS:\n" << Colors::RESET;
        UI::printDivider('-', 80);

        int qIdx = 1;
        for (const auto& res : results) {
            std::string statusStr = res.isCorrect ? (Colors::B_GREEN + "[CORRECT ✓]" + Colors::RESET) 
                                                  : (Colors::B_RED + "[INCORRECT ✗]" + Colors::RESET);
            std::cout << Colors::B_CYAN << "Q" << qIdx << ". " << Colors::BOLD << Colors::WHITE << res.question.getText() << " " << statusStr << "\n";
            std::cout << "   Your Choice   : " << (res.isCorrect ? Colors::B_GREEN : Colors::B_RED) << res.userChoice << Colors::RESET << "\n";
            if (!res.isCorrect) {
                std::cout << "   Correct Answer: " << Colors::B_GREEN << res.question.getCorrectOptionLetter() << Colors::RESET << "\n";
            }
            std::cout << "   " << Colors::CYAN << "Concept Note  : " << Colors::RESET << res.question.getExplanation() << "\n";
            std::cout << Colors::DIM << "--------------------------------------------------------------------------------\n" << Colors::RESET;
            qIdx++;
        }

        // Save Score to Persistence File
        StorageManager::saveScore(student, correctCount, totalQuestions, percentage, totalTimeSec);

        // Certificate generation prompt
        std::cout << "\n  " << Colors::B_YELLOW << "Would you like to generate a printable Certificate file? (Y/N): " << Colors::RESET;
        std::string certChoice = Input::getString("");
        if (!certChoice.empty() && (certChoice[0] == 'Y' || certChoice[0] == 'y')) {
            StorageManager::generateCertificate(student, correctCount, totalQuestions, percentage, totalTimeSec);
        }
        UI::pressEnterToContinue();
    }
};

// ============================================================================
// QUIZ SESSION CONTROLLER
// ============================================================================
void runQuizSession() {
    UI::printHeader("START NEW ASSESSMENT");

    std::cout << Colors::BOLD << Colors::B_YELLOW << "PLEASE ENTER YOUR STUDENT DETAILS:\n" << Colors::RESET;
    UI::printDivider('-', 80);

    std::string name = Input::getString("  [?] Enter Name        : ");
    std::string roll = Input::getString("  [?] Enter Roll Number : ");

    std::cout << "\n  [?] Select Difficulty Level:\n";
    std::cout << "      " << Colors::B_CYAN << "[1]" << Colors::RESET << " EASY   (Encapsulation, Basics & Constructors)\n";
    std::cout << "      " << Colors::B_CYAN << "[2]" << Colors::RESET << " MEDIUM (Polymorphism, Virtual Functions & Abstraction)\n";
    std::cout << "      " << Colors::B_CYAN << "[3]" << Colors::RESET << " HARD   (VTABLE, Memory, RAII & Advanced OOP)\n";
    std::cout << "      " << Colors::B_CYAN << "[4]" << Colors::RESET << " MIXED  (All Levels Combined)\n";
    
    int levelChoice = Input::getMenuChoice(1, 4, "\n  Enter Choice (1-4): ");
    Difficulty level;
    switch (levelChoice) {
        case 1: level = Difficulty::EASY; break;
        case 2: level = Difficulty::MEDIUM; break;
        case 3: level = Difficulty::HARD; break;
        default: level = Difficulty::MIXED; break;
    }

    Student student(name, roll, level);

    // Load Question Bank & Questions
    QuestionBank bank;
    auto questions = bank.getQuestionsForQuiz(level, 10);

    // Countdown before starting
    std::cout << "\n" << Colors::B_YELLOW << "  Hello " << Colors::BOLD << student.getName() 
              << Colors::RESET << Colors::B_YELLOW << "! Your assessment is starting in...\n" << Colors::RESET;
    for (int i = 3; i >= 1; --i) {
        std::cout << Colors::B_CYAN << "        === " << Colors::BOLD << Colors::B_YELLOW << i 
                  << Colors::RESET << Colors::B_CYAN << " ===\n" << Colors::RESET;
        UI::pause(700);
    }
    std::cout << Colors::B_GREEN << "\n  GO! ALL THE BEST!\n" << Colors::RESET;
    UI::pause(600);

    // Conduct Assessment
    auto startTime = std::chrono::high_resolution_clock::now();
    std::vector<QuestionResult> results;

    int qNum = 1;
    int totalCount = static_cast<int>(questions.size());

    for (const auto& q : questions) {
        UI::clearScreen();
        std::cout << Colors::B_CYAN << "STUDENT: " << Colors::B_YELLOW << student.getName() 
                  << Colors::B_CYAN << " (" << student.getRollNumber() << ") | LEVEL: " 
                  << difficultyToString(student.getChosenDifficulty()) << "\n" << Colors::RESET;
        
        q.display(qNum, totalCount);

        auto qStart = std::chrono::high_resolution_clock::now();
        char userChoice = Input::getOptionChoice("  [?] Select your answer (A/B/C/D): ");
        auto qEnd = std::chrono::high_resolution_clock::now();

        double qTimeSec = std::chrono::duration<double>(qEnd - qStart).count();
        bool correct = q.checkAnswer(userChoice);

        if (correct) {
            std::cout << Colors::B_GREEN << "  [✓] Correct Answer!\n" << Colors::RESET;
        } else {
            std::cout << Colors::B_RED << "  [✗] Incorrect! Correct Answer was [" 
                      << q.getCorrectOptionLetter() << "].\n" << Colors::RESET;
        }
        UI::pause(800);

        results.push_back({q, userChoice, correct, qTimeSec});
        qNum++;
    }

    auto endTime = std::chrono::high_resolution_clock::now();
    double totalTimeSec = std::chrono::duration<double>(endTime - startTime).count();

    // Display Result Card
    ResultCard::render(student, results, totalTimeSec);
}

// ============================================================================
// MAIN SYSTEM APP & MENU LOOPER
// ============================================================================
void displayWelcomeBanner() {
    UI::clearScreen();
    std::cout << Colors::B_CYAN << "================================================================================\n";
    std::cout << "          " << Colors::BOLD << Colors::B_YELLOW << "WELCOME TO THE C++ & OOP QUIZ ASSESSMENT SYSTEM" << Colors::RESET << Colors::B_CYAN << "\n";
    std::cout << "================================================================================\n" << Colors::RESET;
    std::cout << Colors::CYAN << "   Designed to evaluate core and advanced Object-Oriented Programming in C++\n\n" << Colors::RESET;
}

int main() {
    // 1. Initialize Terminal ANSI / UTF-8
    initTerminal();

    // 2. Main Menu Loop
    while (true) {
        displayWelcomeBanner();
        std::cout << Colors::BOLD << Colors::WHITE << "  MAIN MENU:\n" << Colors::RESET;
        std::cout << "   " << Colors::B_CYAN << "[1]" << Colors::RESET << " Start New Quiz Assessment\n";
        std::cout << "   " << Colors::B_CYAN << "[2]" << Colors::RESET << " View Leaderboard (Hall of Fame)\n";
        std::cout << "   " << Colors::B_CYAN << "[3]" << Colors::RESET << " About System & OOP Concepts\n";
        std::cout << "   " << Colors::B_CYAN << "[4]" << Colors::RESET << " Exit System\n";
        
        int choice = Input::getMenuChoice(1, 4, "\n  [?] Select an option (1-4): ");

        if (choice == 1) {
            runQuizSession();
        } else if (choice == 2) {
            StorageManager::displayLeaderboard();
        } else if (choice == 3) {
            UI::printHeader("ABOUT THE SYSTEM");
            std::cout << Colors::B_YELLOW << "System Overview:\n" << Colors::RESET;
            std::cout << "  This C++ application evaluates Object-Oriented Programming (OOP) concepts:\n\n";
            std::cout << "  * Encapsulation : Protecting internal data members with strict private specs.\n";
            std::cout << "  * Polymorphism  : Dynamic question evaluation & virtual method dispatch.\n";
            std::cout << "  * Inheritance   : Clean domain object models & clear taxonomy.\n";
            std::cout << "  * Abstraction   : High-level UI and input handling separation.\n";
            std::cout << "  * File I/O      : Persistent leaderboard data & printable certificates.\n\n";
            UI::pressEnterToContinue();
        } else if (choice == 4) {
            UI::clearScreen();
            std::cout << Colors::B_CYAN << "\n"
                      << "================================================================================\n"
                      << "  " << Colors::BOLD << Colors::B_YELLOW << "THANK YOU FOR USING THE C++ & OOP QUIZ ASSESSMENT SYSTEM!" << Colors::RESET << Colors::B_CYAN << "\n"
                      << "  Keep coding in C++ and mastering Object-Oriented Design!\n"
                      << "================================================================================\n"
                      << Colors::RESET << "\n";
            break;
        }
    }

    return 0;
}
