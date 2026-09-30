export const INITIAL_QUESTIONS = [
  // --- EASY LEVEL QUESTIONS ---
  {
    id: 1,
    text: "Which pillar of OOP binds data and functions together into a single unit?",
    options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Encapsulation",
    explanation: "Encapsulation wraps data members and methods inside a class to restrict direct outside access and hide implementation details."
  },
  {
    id: 2,
    text: "What is the default access specifier for members of a class in C++?",
    options: ["public", "protected", "private", "internal"],
    correctOptionIndex: 2,
    difficulty: "EASY",
    topic: "Access Specifiers",
    explanation: "In C++, class members are private by default, whereas struct members are public by default."
  },
  {
    id: 3,
    text: "Which syntax is used to inherit a class in C++?",
    options: ["class Derived extends Base", "class Derived implements Base", "class Derived : public Base", "class Derived super Base"],
    correctOptionIndex: 2,
    difficulty: "EASY",
    topic: "Inheritance Syntax",
    explanation: "Inheritance in C++ uses a colon after the derived class name, e.g., 'class Derived : public Base'."
  },
  {
    id: 4,
    text: "What special member function is automatically executed when an object is created?",
    options: ["Destructor", "Constructor", "Virtual Function", "Friend Function"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Constructors",
    explanation: "Constructors initialize objects when instantiated and share the exact name of the class."
  },
  {
    id: 5,
    text: "Which operator is used to allocate memory dynamically on the heap in C++?",
    options: ["malloc", "alloc", "new", "create"],
    correctOptionIndex: 2,
    difficulty: "EASY",
    topic: "Dynamic Memory",
    explanation: "The 'new' operator allocates memory on the heap and calls the object constructor."
  },
  {
    id: 6,
    text: "What is the return type of a constructor in C++?",
    options: ["void", "int", "pointer to class", "No return type"],
    correctOptionIndex: 3,
    difficulty: "EASY",
    topic: "Constructors",
    explanation: "Constructors do not have any return type, not even void."
  },
  {
    id: 7,
    text: "What member function has the same name as the class preceded by a tilde (~)?",
    options: ["Copy Constructor", "Destructor", "Virtual Method", "Operator Function"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Destructors",
    explanation: "A destructor (~ClassName) cleans up resources when an object goes out of scope or is destroyed."
  },
  {
    id: 8,
    text: "Which access specifier allows members to be accessed by derived classes but NOT outside the class hierarchy?",
    options: ["public", "protected", "private", "default"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Access Control",
    explanation: "'protected' members are accessible within the class and its derived classes, but private to external callers."
  },
  {
    id: 9,
    text: "Which keyword is used to define generic classes and functions in C++?",
    options: ["generic", "template", "type", "concept"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Templates",
    explanation: "The 'template' keyword enables writing generic type-independent C++ code."
  },
  {
    id: 10,
    text: "Which pointer implicitly points to the calling object inside a class member function?",
    options: ["self", "this", "base", "ptr"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "This Pointer",
    explanation: "'this' is an implicit pointer available inside non-static member functions pointing to the invoking object."
  },

  // --- MEDIUM LEVEL QUESTIONS ---
  {
    id: 11,
    text: "Function Overloading and Operator Overloading are examples of what type of polymorphism?",
    options: ["Runtime Polymorphism", "Compile-Time Polymorphism", "Dynamic Binding", "Deferred Binding"],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Polymorphism",
    explanation: "Overloading is resolved during compilation by inspecting function signatures, making it static or compile-time polymorphism."
  },
  {
    id: 12,
    text: "Which keyword enables dynamic binding (runtime polymorphism) in C++?",
    options: ["dynamic", "override", "virtual", "inline"],
    correctOptionIndex: 2,
    difficulty: "MEDIUM",
    topic: "Virtual Functions",
    explanation: "Declaring a method as 'virtual' tells the compiler to perform dynamic dispatch at runtime using a VTABLE lookup."
  },
  {
    id: 13,
    text: "A class containing at least one pure virtual function (= 0) is called what?",
    options: ["Concrete Class", "Abstract Base Class", "Interface Class", "Final Class"],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Abstraction",
    explanation: "Classes with at least one pure virtual function cannot be directly instantiated and are called Abstract Base Classes."
  },
  {
    id: 14,
    text: "Which non-member function can access private and protected members of a class?",
    options: ["Inline Function", "Friend Function", "Static Function", "Virtual Function"],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Friendship",
    explanation: "A 'friend' function declared inside a class is granted special access to its private and protected members."
  },
  {
    id: 15,
    text: "In C++ object inheritance, in what order are constructors executed?",
    options: [
      "Derived Class Constructor first, then Base Class",
      "Base Class Constructor first, then Derived Class",
      "Constructors run in arbitrary order",
      "Only Derived Class Constructor is called"
    ],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Constructor Order",
    explanation: "Base class constructors execute first to construct base sub-objects, followed by derived class constructors."
  },
  {
    id: 16,
    text: "What is the correct syntax for declaring a pure virtual function in C++?",
    options: [
      "virtual void display() = null;",
      "virtual void display() = 0;",
      "pure virtual void display();",
      "virtual void display() abstract;"
    ],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Pure Virtual Functions",
    explanation: "Assigning '= 0;' to a virtual function declaration specifies it as pure virtual."
  },
  {
    id: 17,
    text: "Which C++ cast operator is specifically used for safe downcasting in polymorphic inheritance hierarchies?",
    options: ["static_cast", "const_cast", "dynamic_cast", "reinterpret_cast"],
    correctOptionIndex: 2,
    difficulty: "MEDIUM",
    topic: "RTTI & Casting",
    explanation: "dynamic_cast inspects Runtime Type Information (RTTI) to safely perform downcasts, returning nullptr if invalid."
  },
  {
    id: 18,
    text: "What does declaring a single-argument constructor with the 'explicit' keyword prevent?",
    options: [
      "Object instantiation",
      "Implicit type conversions",
      "Inheritance by derived classes",
      "Destructor invocation"
    ],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Explicit Keyword",
    explanation: "'explicit' prevents the compiler from using single-parameter constructors for implicit type conversions."
  },
  {
    id: 19,
    text: "Which C++ operator CANNOT be overloaded?",
    options: ["+ (addition)", ":: (scope resolution)", "== (equality)", "[] (subscript)"],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Operator Overloading",
    explanation: "Operators like :: (scope resolution), . (member access), and sizeof cannot be overloaded in C++."
  },
  {
    id: 20,
    text: "What is the canonical Copy Constructor signature for a class named 'Student'?",
    options: [
      "Student(Student obj);",
      "Student(const Student& obj);",
      "Student(Student* obj);",
      "void Student(Student& obj);"
    ],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Copy Constructor",
    explanation: "A copy constructor takes a const reference parameter (const Student& obj) to avoid infinite pass-by-value recursive copies."
  },

  // --- HARD LEVEL QUESTIONS ---
  {
    id: 21,
    text: "Why should a Base class destructor always be declared as 'virtual' when derived classes are deleted via base pointers?",
    options: [
      "To prevent compilation errors",
      "To ensure the Derived class destructor is invoked to prevent memory leaks",
      "To speed up execution",
      "To make destructors public"
    ],
    correctOptionIndex: 1,
    difficulty: "HARD",
    topic: "Virtual Destructors",
    explanation: "If a base destructor is not virtual, deleting a derived object via a base pointer causes undefined behavior and resource leaks."
  },
  {
    id: 22,
    text: "What ambiguity problem arises when a class inherits from two classes that derive from a common base class?",
    options: ["Slicing Problem", "Diamond Problem", "Dangling Reference", "Shadowing Problem"],
    correctOptionIndex: 1,
    difficulty: "HARD",
    topic: "Multiple Inheritance",
    explanation: "The Diamond Problem occurs when a derived class inherits multiple copies of a shared grandparent class sub-object."
  },
  {
    id: 23,
    text: "How is the Diamond Problem resolved in C++ multiple inheritance?",
    options: [
      "By using friend classes",
      "By using virtual base class (virtual inheritance)",
      "By using static methods",
      "By using private inheritance"
    ],
    correctOptionIndex: 1,
    difficulty: "HARD",
    topic: "Virtual Inheritance",
    explanation: "Using virtual inheritance ('class B : virtual public A') ensures only a single shared instance of the grandparent base class is instantiated."
  },
  {
    id: 24,
    text: "What is Object Slicing in C++?",
    options: [
      "Assigning a derived object to a base object by value, stripping derived attributes",
      "Splitting an array of objects into chunks",
      "Deleting part of an object from memory",
      "Converting a class into a struct"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "Object Slicing",
    explanation: "When assigning a derived object to a base object by value, derived fields and VTABLE pointers are sliced off."
  },
  {
    id: 25,
    text: "What internal lookup table does the C++ compiler generate per class to support virtual function dispatch?",
    options: ["VTABLE (Virtual Table)", "Stack Frame", "Symbol Map", "Heap Registry"],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "VTABLE & VPTR",
    explanation: "The compiler constructs a VTABLE containing function pointers for virtual functions to enable dynamic runtime dispatch."
  },
  {
    id: 26,
    text: "Which smart pointer provides exclusive non-shareable ownership of dynamic memory?",
    options: ["std::shared_ptr", "std::weak_ptr", "std::unique_ptr", "std::auto_ptr"],
    correctOptionIndex: 2,
    difficulty: "HARD",
    topic: "RAII & Smart Pointers",
    explanation: "std::unique_ptr owns a dynamic resource exclusively and cannot be copied, only moved."
  },
  {
    id: 27,
    text: "What core programming idiom binds resource lifecycle to object lifespan in C++?",
    options: ["RTTI", "RAII (Resource Acquisition Is Initialization)", "CRTP", "SFINAE"],
    correctOptionIndex: 1,
    difficulty: "HARD",
    topic: "RAII",
    explanation: "RAII guarantees that acquired resources (heap memory, sockets, file descriptors) are released when objects go out of scope."
  },
  {
    id: 28,
    text: "What does the C++11 'override' specifier enforce at compile-time?",
    options: [
      "Forces a function to be inline",
      "Ensures the member function correctly overrides a virtual function in a base class",
      "Prevents function modification",
      "Disables virtual dispatch"
    ],
    correctOptionIndex: 1,
    difficulty: "HARD",
    topic: "Override Specifier",
    explanation: "'override' produces a compiler error if the method does not match any virtual method signature in base classes."
  },
  {
    id: 29,
    text: "What happens if an unhandled exception is thrown inside a destructor during stack unwinding?",
    options: [
      "The exception is ignored",
      "std::terminate() is called, terminating the program immediately",
      "The program restarts",
      "The destructor is retried"
    ],
    correctOptionIndex: 1,
    difficulty: "HARD",
    topic: "Exceptions & Destructors",
    explanation: "Throwing an exception from a destructor during stack unwinding leads to multiple active exceptions, invoking std::terminate()."
  },
  {
    id: 30,
    text: "What is the minimum size of an empty class object in C++?",
    options: ["0 bytes", "1 byte (or non-zero)", "4 bytes", "8 bytes"],
    correctOptionIndex: 1,
    difficulty: "HARD",
    topic: "Object Layout",
    explanation: "In C++, empty class objects have a size of at least 1 byte to ensure distinct memory addresses for instances."
  }
];

export const DEFAULT_QUIZ_SETTINGS = {
  questionsPerRound: 10,
  timePerQuestionSec: 30, // 30s * 10 = 300s total or overall time
  marksPerQuestion: 4,
  negativeMarks: 1,
  allowNegativeMarking: true,
  strictAntiCheat: true,
  passingPercentage: 60
};
