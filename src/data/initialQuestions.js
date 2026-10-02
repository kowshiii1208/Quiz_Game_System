export const INITIAL_QUESTIONS = [
  // ==========================================
  // --- C++ QUESTIONS (30 QUESTIONS) ---
  // ==========================================
  // --- C++ EASY ---
  {
    id: 1,
    language: "CPP",
    text: "Which pillar of OOP binds data and functions together into a single unit?",
    options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Encapsulation",
    explanation: "Encapsulation wraps data members and methods inside a class to restrict direct outside access and hide implementation details."
  },
  {
    id: 2,
    language: "CPP",
    text: "What is the default access specifier for members of a class in C++?",
    options: ["public", "protected", "private", "internal"],
    correctOptionIndex: 2,
    difficulty: "EASY",
    topic: "Access Specifiers",
    explanation: "In C++, class members are private by default, whereas struct members are public by default."
  },
  {
    id: 3,
    language: "CPP",
    text: "Which syntax is used to inherit a class in C++?",
    options: ["class Derived extends Base", "class Derived implements Base", "class Derived : public Base", "class Derived super Base"],
    correctOptionIndex: 2,
    difficulty: "EASY",
    topic: "Inheritance Syntax",
    explanation: "Inheritance in C++ uses a colon after the derived class name, e.g., 'class Derived : public Base'."
  },
  {
    id: 4,
    language: "CPP",
    text: "What special member function is automatically executed when an object is created?",
    options: ["Destructor", "Constructor", "Virtual Function", "Friend Function"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Constructors",
    explanation: "Constructors initialize objects when instantiated and share the exact name of the class."
  },
  {
    id: 5,
    language: "CPP",
    text: "Which operator is used to allocate memory dynamically on the heap in C++?",
    options: ["malloc", "alloc", "new", "create"],
    correctOptionIndex: 2,
    difficulty: "EASY",
    topic: "Dynamic Memory",
    explanation: "The 'new' operator allocates memory on the heap and calls the object constructor."
  },
  {
    id: 6,
    language: "CPP",
    text: "What is the return type of a constructor in C++?",
    options: ["void", "int", "pointer to class", "No return type"],
    correctOptionIndex: 3,
    difficulty: "EASY",
    topic: "Constructors",
    explanation: "Constructors do not have any return type, not even void."
  },
  {
    id: 7,
    language: "CPP",
    text: "What member function has the same name as the class preceded by a tilde (~)?",
    options: ["Copy Constructor", "Destructor", "Virtual Method", "Operator Function"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Destructors",
    explanation: "A destructor (~ClassName) cleans up resources when an object goes out of scope or is destroyed."
  },
  {
    id: 8,
    language: "CPP",
    text: "Which access specifier allows members to be accessed by derived classes but NOT outside the class hierarchy?",
    options: ["public", "protected", "private", "default"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Access Control",
    explanation: "'protected' members are accessible within the class and its derived classes, but private to external callers."
  },
  {
    id: 9,
    language: "CPP",
    text: "Which keyword is used to define generic classes and functions in C++?",
    options: ["generic", "template", "type", "concept"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Templates",
    explanation: "The 'template' keyword enables writing generic type-independent C++ code."
  },
  {
    id: 10,
    language: "CPP",
    text: "Which pointer implicitly points to the calling object inside a class member function?",
    options: ["self", "this", "base", "ptr"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "This Pointer",
    explanation: "'this' is an implicit pointer available inside non-static member functions pointing to the invoking object."
  },

  // --- C++ MEDIUM ---
  {
    id: 11,
    language: "CPP",
    text: "Function Overloading and Operator Overloading are examples of what type of polymorphism?",
    options: ["Runtime Polymorphism", "Compile-Time Polymorphism", "Dynamic Binding", "Deferred Binding"],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Polymorphism",
    explanation: "Overloading is resolved during compilation by inspecting function signatures, making it static or compile-time polymorphism."
  },
  {
    id: 12,
    language: "CPP",
    text: "Which keyword enables dynamic binding (runtime polymorphism) in C++?",
    options: ["dynamic", "override", "virtual", "inline"],
    correctOptionIndex: 2,
    difficulty: "MEDIUM",
    topic: "Virtual Functions",
    explanation: "Declaring a method as 'virtual' tells the compiler to perform dynamic dispatch at runtime using a VTABLE lookup."
  },
  {
    id: 13,
    language: "CPP",
    text: "A class containing at least one pure virtual function (= 0) is called what?",
    options: ["Concrete Class", "Abstract Base Class", "Interface Class", "Final Class"],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Abstraction",
    explanation: "Classes with at least one pure virtual function cannot be directly instantiated and are called Abstract Base Classes."
  },
  {
    id: 14,
    language: "CPP",
    text: "Which non-member function can access private and protected members of a class?",
    options: ["Inline Function", "Friend Function", "Static Function", "Virtual Function"],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Friendship",
    explanation: "A 'friend' function declared inside a class is granted special access to its private and protected members."
  },
  {
    id: 15,
    language: "CPP",
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
    language: "CPP",
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
    language: "CPP",
    text: "Which C++ cast operator is specifically used for safe downcasting in polymorphic inheritance hierarchies?",
    options: ["static_cast", "const_cast", "dynamic_cast", "reinterpret_cast"],
    correctOptionIndex: 2,
    difficulty: "MEDIUM",
    topic: "RTTI & Casting",
    explanation: "dynamic_cast inspects Runtime Type Information (RTTI) to safely perform downcasts, returning nullptr if invalid."
  },
  {
    id: 18,
    language: "CPP",
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
    language: "CPP",
    text: "Which C++ operator CANNOT be overloaded?",
    options: ["+ (addition)", ":: (scope resolution)", "== (equality)", "[] (subscript)"],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Operator Overloading",
    explanation: "Operators like :: (scope resolution), . (member access), and sizeof cannot be overloaded in C++."
  },
  {
    id: 20,
    language: "CPP",
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

  // --- C++ HARD ---
  {
    id: 21,
    language: "CPP",
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
    language: "CPP",
    text: "What ambiguity problem arises when a class inherits from two classes that derive from a common base class?",
    options: ["Slicing Problem", "Diamond Problem", "Dangling Reference", "Shadowing Problem"],
    correctOptionIndex: 1,
    difficulty: "HARD",
    topic: "Multiple Inheritance",
    explanation: "The Diamond Problem occurs when a derived class inherits multiple copies of a shared grandparent class sub-object."
  },
  {
    id: 23,
    language: "CPP",
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
    language: "CPP",
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
    language: "CPP",
    text: "What internal lookup table does the C++ compiler generate per class to support virtual function dispatch?",
    options: ["VTABLE (Virtual Table)", "Stack Frame", "Symbol Map", "Heap Registry"],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "VTABLE & VPTR",
    explanation: "The compiler constructs a VTABLE containing function pointers for virtual functions to enable dynamic runtime dispatch."
  },
  {
    id: 26,
    language: "CPP",
    text: "Which smart pointer provides exclusive non-shareable ownership of dynamic memory?",
    options: ["std::shared_ptr", "std::weak_ptr", "std::unique_ptr", "std::auto_ptr"],
    correctOptionIndex: 2,
    difficulty: "HARD",
    topic: "RAII & Smart Pointers",
    explanation: "std::unique_ptr owns a dynamic resource exclusively and cannot be copied, only moved."
  },
  {
    id: 27,
    language: "CPP",
    text: "What core programming idiom binds resource lifecycle to object lifespan in C++?",
    options: ["RTTI", "RAII (Resource Acquisition Is Initialization)", "CRTP", "SFINAE"],
    correctOptionIndex: 1,
    difficulty: "HARD",
    topic: "RAII",
    explanation: "RAII guarantees that acquired resources (heap memory, sockets, file descriptors) are released when objects go out of scope."
  },
  {
    id: 28,
    language: "CPP",
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
    language: "CPP",
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
    language: "CPP",
    text: "What is the minimum size of an empty class object in C++?",
    options: ["0 bytes", "1 byte (or non-zero)", "4 bytes", "8 bytes"],
    correctOptionIndex: 1,
    difficulty: "HARD",
    topic: "Object Layout",
    explanation: "In C++, empty class objects have a size of at least 1 byte to ensure distinct memory addresses for instances."
  },

  // ==========================================
  // --- JAVA QUESTIONS (30 QUESTIONS) ---
  // ==========================================
  // --- JAVA EASY ---
  {
    id: 31,
    language: "JAVA",
    text: "Which keyword in Java is used to inherit a class?",
    options: ["implements", "extends", "inherits", "super"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Inheritance",
    explanation: "In Java, the 'extends' keyword is used by a child class to inherit fields and methods from a parent class."
  },
  {
    id: 32,
    language: "JAVA",
    text: "What is the root class of all classes in Java object hierarchy?",
    options: ["java.lang.System", "java.lang.Object", "java.lang.Class", "java.util.Base"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Java Fundamentals",
    explanation: "Every class in Java directly or indirectly inherits from java.lang.Object."
  },
  {
    id: 33,
    language: "JAVA",
    text: "Which access modifier makes a class member accessible ONLY within its own class?",
    options: ["protected", "public", "private", "default (package-private)"],
    correctOptionIndex: 2,
    difficulty: "EASY",
    topic: "Access Modifiers",
    explanation: "The 'private' modifier restricts visibility strictly inside the declaring class."
  },
  {
    id: 34,
    language: "JAVA",
    text: "Which feature of Java allows multiple methods in the same class to share the same name with different parameters?",
    options: ["Method Overriding", "Method Overloading", "Method Hiding", "Dynamic Dispatch"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Overloading",
    explanation: "Method Overloading occurs when multiple methods in the same class have identical names but different parameter lists."
  },
  {
    id: 35,
    language: "JAVA",
    text: "What is the default value of an uninitialized boolean instance variable in Java?",
    options: ["true", "false", "null", "0"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Data Types",
    explanation: "Instance boolean variables are automatically initialized to false by the JVM."
  },
  {
    id: 36,
    language: "JAVA",
    text: "Which keyword is used to create an instance of a class in Java?",
    options: ["create", "alloc", "new", "instanceof"],
    correctOptionIndex: 2,
    difficulty: "EASY",
    topic: "Instantiation",
    explanation: "The 'new' keyword allocates memory on the heap and executes the class constructor."
  },
  {
    id: 37,
    language: "JAVA",
    text: "Which keyword prevents a class from being inherited in Java?",
    options: ["abstract", "final", "static", "sealed"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Final Keyword",
    explanation: "A 'final' class cannot be subclassed or extended."
  },
  {
    id: 38,
    language: "JAVA",
    text: "Which package is automatically imported into every Java source file?",
    options: ["java.util", "java.io", "java.lang", "java.net"],
    correctOptionIndex: 2,
    difficulty: "EASY",
    topic: "Packages",
    explanation: "The java.lang package (containing String, System, Object, Math) is imported implicitly."
  },
  {
    id: 39,
    language: "JAVA",
    text: "What is the return type of the main method in Java?",
    options: ["int", "void", "String", "boolean"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Main Method Syntax",
    explanation: "The canonical signature is 'public static void main(String[] args)' where return type is void."
  },
  {
    id: 40,
    language: "JAVA",
    text: "Which operator is used to check if an object is an instance of a specific class?",
    options: ["typeof", "isinstance", "instanceof", "is"],
    correctOptionIndex: 2,
    difficulty: "EASY",
    topic: "Type Checking",
    explanation: "The 'instanceof' binary operator tests whether an object reference refers to an instance of a given type."
  },

  // --- JAVA MEDIUM ---
  {
    id: 41,
    language: "JAVA",
    text: "Which keyword is used by a class to implement an interface in Java?",
    options: ["extends", "implements", "uses", "inherits"],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Interfaces",
    explanation: "A Java class uses the 'implements' keyword to fulfill contracts specified by an interface."
  },
  {
    id: 42,
    language: "JAVA",
    text: "What is the difference between String, StringBuilder, and StringBuffer in Java?",
    options: [
      "String is mutable; StringBuilder is immutable",
      "String is immutable; StringBuilder is mutable and not thread-safe; StringBuffer is mutable and thread-safe",
      "StringBuffer is faster than StringBuilder",
      "All three are completely identical"
    ],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "String Memory & Immutability",
    explanation: "Strings are immutable. StringBuilder provides synchronized-free high performance mutable strings, while StringBuffer methods are synchronized for multi-threading."
  },
  {
    id: 43,
    language: "JAVA",
    text: "What happens when a method is declared as 'static' in Java?",
    options: [
      "It cannot access instance variables or instance methods directly",
      "It cannot be called without instantiating an object",
      "It is executed concurrently in a separate thread",
      "It can be overridden dynamically by subclasses"
    ],
    correctOptionIndex: 0,
    difficulty: "MEDIUM",
    topic: "Static Keyword",
    explanation: "Static methods belong to the class level rather than object instances, so they cannot access non-static instance variables."
  },
  {
    id: 44,
    language: "JAVA",
    text: "How does Java handle Multiple Inheritance of classes?",
    options: [
      "Java fully supports multiple inheritance of classes using commas",
      "Java does NOT support multiple inheritance of classes to avoid ambiguity (Diamond Problem), but allows multiple interface implementation",
      "Java uses virtual inheritance for class ambiguity",
      "Java supports multiple inheritance using friend classes"
    ],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Multiple Inheritance",
    explanation: "Java disallows extending multiple classes to avoid the Diamond Problem, relying on interfaces for multi-typing."
  },
  {
    id: 45,
    language: "JAVA",
    text: "Which exception is thrown when an array is accessed with an invalid index in Java?",
    options: [
      "NullPointerException",
      "IndexOutOfBoundsException",
      "ArrayIndexOutOfBoundsException",
      "IllegalArgumentException"
    ],
    correctOptionIndex: 2,
    difficulty: "MEDIUM",
    topic: "Exception Handling",
    explanation: "ArrayIndexOutOfBoundsException is thrown at runtime when accessing an array with a negative index or index >= length."
  },
  {
    id: 46,
    language: "JAVA",
    text: "What is the purpose of the 'finally' block in Java try-catch-finally statements?",
    options: [
      "Executes only if an exception is caught",
      "Executes regardless of whether an exception is thrown or caught, usually for resource cleanup",
      "Prevents exceptions from being thrown",
      "Terminates the JVM immediately"
    ],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Try-Catch-Finally",
    explanation: "The 'finally' block always executes after try/catch blocks complete, ensuring resource cleanup like closing files or DB connections."
  },
  {
    id: 47,
    language: "JAVA",
    text: "What is Garbage Collection in Java?",
    options: [
      "Manual deallocation of memory using free()",
      "Automatic process in JVM that reclaims memory occupied by unreachable objects",
      "A compiler optimization pass",
      "A method to delete files from hard drive"
    ],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Garbage Collection",
    explanation: "Java's automatic Garbage Collector (GC) runs in the background to free memory taken by objects no longer referenced."
  },
  {
    id: 48,
    language: "JAVA",
    text: "What is the effect of declaring a variable as 'transient' in Java?",
    options: [
      "It prevents the variable from being serialized during object serialization",
      "It makes the variable thread-safe",
      "It stores the variable in CPU registers",
      "It marks the variable as read-only"
    ],
    correctOptionIndex: 0,
    difficulty: "MEDIUM",
    topic: "Serialization & Transient",
    explanation: "The 'transient' modifier tells the Java Serialization framework to skip this field when serializing an object."
  },
  {
    id: 49,
    language: "JAVA",
    text: "Which collection interface in Java guarantees elements are unique and contains no duplicates?",
    options: ["List", "Set", "Queue", "Map"],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Java Collections Framework",
    explanation: "The java.util.Set interface models the mathematical set abstraction and enforces uniqueness."
  },
  {
    id: 50,
    language: "JAVA",
    text: "What is the superclass of all Exception and Error classes in Java?",
    options: ["java.lang.Throwable", "java.lang.Object", "java.lang.RuntimeException", "java.lang.CustomError"],
    correctOptionIndex: 0,
    difficulty: "MEDIUM",
    topic: "Exception Hierarchy",
    explanation: "Throwable is the superclass of all errors and exceptions in the Java language."
  },

  // --- JAVA HARD ---
  {
    id: 51,
    language: "JAVA",
    text: "What does the 'volatile' keyword guarantee in Java multi-threading?",
    options: [
      "Mutual exclusion and lock acquisition",
      "Direct memory visibility across threads by bypassing CPU cache reads/writes",
      "Atomicity of compound operations like count++",
      "Automatic thread creation"
    ],
    correctOptionIndex: 1,
    difficulty: "HARD",
    topic: "Java Memory Model & Volatile",
    explanation: "'volatile' ensures reads and writes are made directly to main memory rather than CPU local caches, establishing a happens-before relationship."
  },
  {
    id: 52,
    language: "JAVA",
    text: "What is Type Erasure in Java Generics?",
    options: [
      "Removal of variable types during runtime by replacing generic type parameters with Object or bounds",
      "Deleting invalid classes from memory",
      "Casting primitive types to wrapper classes",
      "Removing duplicate entries from Collections"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "Generics & Type Erasure",
    explanation: "Java compiler applies type erasure to enforce type safety at compile time and erase generic parameters, maintaining backward compatibility with older bytecode."
  },
  {
    id: 53,
    language: "JAVA",
    text: "What is the difference between fail-fast and fail-safe iterators in Java Collections?",
    options: [
      "Fail-fast iterators throw ConcurrentModificationException if modified during iteration; Fail-safe iterate over a clone copy",
      "Fail-fast iterators are thread-safe; Fail-safe are not",
      "Fail-fast never throw errors; Fail-safe crash immediately",
      "There is no operational difference"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "Collections & Concurrency",
    explanation: "Fail-fast iterators (like ArrayList Iterator) throw ConcurrentModificationException upon concurrent modification, whereas fail-safe (like CopyOnWriteArrayList) operate on a copy."
  },
  {
    id: 54,
    language: "JAVA",
    text: "How does the JVM Memory Structure divide memory spaces for execution?",
    options: [
      "Heap, Stack, Program Counter (PC) Register, Native Method Stack, and Metaspace",
      "RAM, Hard Drive, Cache",
      "Global Segment and Local Segment",
      "Buffer Pool and Data Pool"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "JVM Architecture",
    explanation: "JVM runtime data areas include Heap (objects), Stack (frames/variables), PC Register, Native Stack, and Metaspace (class metadata)."
  },
  {
    id: 55,
    language: "JAVA",
    text: "What is the Diamond Operator (<>) introduced in Java 7 used for?",
    options: [
      "Type inference during generic object instantiation, avoiding redundant type parameters on the right side",
      "Bitwise XOR calculation",
      "Diamond inheritance syntax",
      "XML parsing tag"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "Java Generics Syntax",
    explanation: "The diamond operator allows writing 'List<String> list = new ArrayList<>()' where the compiler infers the generic type automatically."
  },
  {
    id: 56,
    language: "JAVA",
    text: "What is a Memory Leak in Java despite Garbage Collection?",
    options: [
      "Unreferenced objects staying in memory",
      "Unused objects still being referenced directly or indirectly, preventing the GC from reclaiming them",
      "Hardware RAM failure",
      "Excessive creation of primitive data types"
    ],
    correctOptionIndex: 1,
    difficulty: "HARD",
    topic: "Memory Management",
    explanation: "In Java, memory leaks happen when objects that are no longer needed remain referenced in static fields, listeners, or collections."
  },
  {
    id: 57,
    language: "JAVA",
    text: "What is a Functional Interface in Java 8?",
    options: [
      "An interface with zero methods",
      "An interface containing exactly ONE abstract method, marked optionally with @FunctionalInterface",
      "An interface with only static methods",
      "An interface that cannot be implemented"
    ],
    correctOptionIndex: 1,
    difficulty: "HARD",
    topic: "Functional Interfaces & Lambdas",
    explanation: "Functional interfaces have a single abstract method (SAM) and serve as target types for Lambda expressions and method references."
  },
  {
    id: 58,
    language: "JAVA",
    text: "What is the difference between synchronized method and synchronized block in Java?",
    options: [
      "Synchronized method locks the entire method/object; Synchronized block locks only a specific critical section of code",
      "Synchronized blocks run slower than synchronized methods",
      "Synchronized methods do not use monitor locks",
      "Synchronized blocks cannot accept parameters"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "Multi-threading & Synchronization",
    explanation: "Synchronized blocks offer finer grain lock control over specific shared objects rather than locking the entire object instance."
  },
  {
    id: 59,
    language: "JAVA",
    text: "Which ClassLoader in Java is responsible for loading core Java runtime classes (rt.jar / java.base)?",
    options: ["Application ClassLoader", "Extension ClassLoader", "Bootstrap ClassLoader", "System ClassLoader"],
    correctOptionIndex: 2,
    difficulty: "HARD",
    topic: "JVM Class Loading",
    explanation: "The Bootstrap ClassLoader is written in native C/C++ code and loads fundamental core JDK classes."
  },
  {
    id: 60,
    language: "JAVA",
    text: "What does Method Reference (System.out::println) represent in Java 8?",
    options: [
      "A shorthand syntax for a Lambda expression calling an existing method",
      "A pointer to a memory address",
      "A reflex reflection invocation",
      "A static import statement"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "Method References",
    explanation: "Method references provide readable syntactic sugar for lambda expressions that simply invoke an existing method."
  },

  // ==========================================
  // --- PYTHON QUESTIONS (30 QUESTIONS) ---
  // ==========================================
  // --- PYTHON EASY ---
  {
    id: 61,
    language: "PYTHON",
    text: "Which keyword is used to define a function in Python?",
    options: ["function", "func", "def", "define"],
    correctOptionIndex: 2,
    difficulty: "EASY",
    topic: "Python Functions",
    explanation: "Functions in Python are declared using the 'def' keyword followed by the function name and parameters."
  },
  {
    id: 62,
    language: "PYTHON",
    text: "What is the correct way to declare a class in Python?",
    options: ["class Student:", "create class Student", "class Student{}", "struct Student:"],
    correctOptionIndex: 0,
    difficulty: "EASY",
    topic: "Classes & Objects",
    explanation: "Classes in Python are declared using 'class ClassName:' syntax followed by indented member definitions."
  },
  {
    id: 63,
    language: "PYTHON",
    text: "Which method acts as the Constructor of a class in Python?",
    options: ["__create__()", "__init__()", "constructor()", "__main__()"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Constructors",
    explanation: "The __init__ dunder method is automatically invoked when an instance of a class is created."
  },
  {
    id: 64,
    language: "PYTHON",
    text: "What parameter must be explicitly passed as the first parameter to instance methods in Python?",
    options: ["this", "self", "me", "ptr"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Self Parameter",
    explanation: "By convention and rule, instance methods must take 'self' as their first parameter to bind to the instance."
  },
  {
    id: 65,
    language: "PYTHON",
    text: "Which Python data structure is ordered, mutable, and defined using square brackets []?",
    options: ["Tuple", "List", "Dictionary", "Set"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Data Structures",
    explanation: "Lists in Python are mutable, ordered sequences enclosed within square brackets []."
  },
  {
    id: 66,
    language: "PYTHON",
    text: "Which data structure in Python is IMMUTABLE and enclosed in parentheses ()?",
    options: ["List", "Tuple", "Set", "Dictionary"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Tuples",
    explanation: "Tuples are immutable sequence data types declared using round parentheses ()."
  },
  {
    id: 67,
    language: "PYTHON",
    text: "How do you create a private attribute inside a class in Python by convention?",
    options: ["private name", "var name: private", "__name (double leading underscores)", "@private name"],
    correctOptionIndex: 2,
    difficulty: "EASY",
    topic: "Encapsulation & Name Mangling",
    explanation: "Prefixing an attribute with double underscores (__attr) invokes name mangling in Python to make it pseudo-private."
  },
  {
    id: 68,
    language: "PYTHON",
    text: "Which keyword is used to handle exceptions in Python along with 'try'?",
    options: ["catch", "except", "error", "handle"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Exception Handling",
    explanation: "Python uses 'try' and 'except' blocks for exception catching and handling."
  },
  {
    id: 69,
    language: "PYTHON",
    text: "What is the output of print(type([])) in Python?",
    options: ["<class 'array'>", "<class 'list'>", "<class 'tuple'>", "<class 'object'>"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    topic: "Type Checking",
    explanation: "The [] literal denotes a Python list object instance of <class 'list'>."
  },
  {
    id: 70,
    language: "PYTHON",
    text: "Which built-in function returns the total number of items in an iterable object in Python?",
    options: ["count()", "size()", "len()", "length()"],
    correctOptionIndex: 2,
    difficulty: "EASY",
    topic: "Built-in Functions",
    explanation: "len(iterable) calculates and returns the number of elements in sequences and collections."
  },

  // --- PYTHON MEDIUM ---
  {
    id: 71,
    language: "PYTHON",
    text: "What does the super() function do in Python class inheritance?",
    options: [
      "Returns a proxy object delegating method calls to a parent or sibling class",
      "Deletes the parent class",
      "Creates a new subclass instance",
      "Calls the global destructor"
    ],
    correctOptionIndex: 0,
    difficulty: "MEDIUM",
    topic: "Inheritance & Super",
    explanation: "super() returns a temporary proxy object of the superclass, allowing calls to base class methods like super().__init__()."
  },
  {
    id: 72,
    language: "PYTHON",
    text: "What is a Python Decorator (@decorator_name)?",
    options: [
      "A graphical visual styling component",
      "A function that takes another function as an argument and extends its behavior without modifying it directly",
      "A type annotation tool",
      "A method to delete variables"
    ],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Decorators",
    explanation: "Decorators are callable higher-order functions that wrap another function to modify or augment its functionality."
  },
  {
    id: 73,
    language: "PYTHON",
    text: "What is the difference between *args and **kwargs in Python function parameters?",
    options: [
      "*args passes positional arguments as a tuple; **kwargs passes keyword arguments as a dictionary",
      "*args passes dictionaries; **kwargs passes lists",
      "*args is for integers; **kwargs is for strings",
      "They are identical"
    ],
    correctOptionIndex: 0,
    difficulty: "MEDIUM",
    topic: "Varargs & Kwargs",
    explanation: "*args collects arbitrary non-keyword positional arguments into a tuple, while **kwargs collects arbitrary keyword arguments into a dictionary."
  },
  {
    id: 74,
    language: "PYTHON",
    text: "What is List Comprehension in Python?",
    options: [
      "A concise, elegant syntax for creating lists based on existing iterables: [expr for item in iterable]",
      "A method to compress lists in ZIP format",
      "A tool to check if a list is sorted",
      "A type casting rule"
    ],
    correctOptionIndex: 0,
    difficulty: "MEDIUM",
    topic: "List Comprehensions",
    explanation: "List comprehension provides a compact syntax for building lists by applying expressions over iterables with optional filtering."
  },
  {
    id: 75,
    language: "PYTHON",
    text: "What is a Generator in Python and what keyword produces generator values?",
    options: [
      "A function that returns a list; 'return'",
      "A function that returns an iterator yielding items one at a time on demand; 'yield'",
      "A class factory; 'build'",
      "A multi-threaded task runner; 'run'"
    ],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Generators & Yield",
    explanation: "Generators use the 'yield' keyword to produce values lazily one by one, preserving state between yields and conserving memory."
  },
  {
    id: 76,
    language: "PYTHON",
    text: "What is the Method Resolution Order (MRO) in Python multiple inheritance?",
    options: [
      "The order in which Python searches parent classes when looking up methods or attributes",
      "The order functions are compiled",
      "The sorting order of dictionary keys",
      "The execution sequence of threads"
    ],
    correctOptionIndex: 0,
    difficulty: "MEDIUM",
    topic: "MRO & C3 Linearization",
    explanation: "MRO specifies the linear search path Python uses to resolve attributes in complex inheritance graphs, computed via the C3 Linearization algorithm."
  },
  {
    id: 77,
    language: "PYTHON",
    text: "What is the difference between 'is' and '==' operators in Python?",
    options: [
      "'==' checks value equality; 'is' checks identity (whether two variables refer to the exact same object in memory)",
      "'is' checks values; '==' checks memory addresses",
      "They are interchangeable in all cases",
      "'is' only works for numbers"
    ],
    correctOptionIndex: 0,
    difficulty: "MEDIUM",
    topic: "Identity vs Equality",
    explanation: "'==' checks if values are equivalent, whereas 'is' evaluates to True only if id(a) == id(b) (same memory object)."
  },
  {
    id: 78,
    language: "PYTHON",
    text: "What is the purpose of @classmethod and @staticmethod decorators in Python?",
    options: [
      "@classmethod receives the class (cls) as first argument; @staticmethod receives neither instance nor class implicitly",
      "They are identical decorators",
      "@classmethod cannot access class attributes",
      "@staticmethod can access self"
    ],
    correctOptionIndex: 0,
    difficulty: "MEDIUM",
    topic: "Class vs Static Methods",
    explanation: "@classmethod takes 'cls' to operate on class variables or factories, while @staticmethod behaves like a plain utility function inside class namespace."
  },
  {
    id: 79,
    language: "PYTHON",
    text: "What is a Lambda function in Python?",
    options: [
      "A recursive function",
      "An anonymous, inline single-expression function defined with the 'lambda' keyword",
      "A multi-line function declaration",
      "A system process hook"
    ],
    correctOptionIndex: 1,
    difficulty: "MEDIUM",
    topic: "Lambda Expressions",
    explanation: "Lambda functions are small, anonymous functions restricted to a single evaluated expression: lambda x, y: x + y."
  },
  {
    id: 80,
    language: "PYTHON",
    text: "What is the function of Context Managers and the 'with' statement in Python?",
    options: [
      "Guarantees resource setup and teardown (e.g., closing files) using __enter__() and __exit__() dunder methods",
      "Creates global variables",
      "Speeds up loop execution",
      "Disables garbage collection"
    ],
    correctOptionIndex: 0,
    difficulty: "MEDIUM",
    topic: "Context Managers",
    explanation: "The 'with' statement manages context lifecycles cleanly by ensuring __exit__() executes to release resources even if exceptions occur."
  },

  // --- PYTHON HARD ---
  {
    id: 81,
    language: "PYTHON",
    text: "What is the Global Interpreter Lock (GIL) in CPython?",
    options: [
      "A mutex lock that allows only one native thread to execute Python bytecode at a time in CPython",
      "A security lock preventing unauthorized imports",
      "A database lock for file writes",
      "A memory allocator lock"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "CPython & GIL",
    explanation: "The GIL is a thread-synchronization mechanism in CPython preventing multiple native threads from executing Python bytecodes simultaneously."
  },
  {
    id: 82,
    language: "PYTHON",
    text: "What is a Metaclass in Python?",
    options: [
      "The 'class of a class' that defines how classes themselves are constructed (type is the default metaclass)",
      "An abstract base class",
      "A subclass of object",
      "A module level container"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "Metaclasses",
    explanation: "Metaclasses instantiate and customize class definitions. Just as classes create objects, metaclasses create classes."
  },
  {
    id: 83,
    language: "PYTHON",
    text: "What is the purpose of __slots__ in Python class definitions?",
    options: [
      "Restricts dynamic attribute creation and replaces __dict__ to significantly save memory",
      "Creates thread pools",
      "Defines database schema slots",
      "Restricts method inheritance"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "Slots & Memory Optimization",
    explanation: "Declaring __slots__ = ('attr1', 'attr2') avoids per-instance __dict__ creation, reducing memory footprint for millions of instances."
  },
  {
    id: 84,
    language: "PYTHON",
    text: "What is a Closure in Python?",
    options: [
      "A nested function that retains access to variables in its enclosing lexical scope even after the outer function finishes execution",
      "A method to close file streams",
      "A block of code inside try-finally",
      "A destructor function"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "Closures & Lexical Scope",
    explanation: "Closures occur when an inner function references free variables from an outer enclosing scope, binding those variables to the function cell object."
  },
  {
    id: 85,
    language: "PYTHON",
    text: "What is the difference between shallow copy and deep copy in Python's copy module?",
    options: [
      "Shallow copy copies object structure but references nested objects; Deep copy recursively copies all nested objects",
      "Shallow copy is slower than deep copy",
      "Deep copy affects only primitive types",
      "They are identical for compound objects"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "Shallow vs Deep Copy",
    explanation: "copy.copy() creates a new compound object inserting references to originals, while copy.deepcopy() constructs new copies recursively."
  },
  {
    id: 86,
    language: "PYTHON",
    text: "What are Dunder (Double Underscore) Magic Methods in Python?",
    options: [
      "Special predefined methods (like __str__, __add__, __getitem__) that enable operator overloading and built-in protocols",
      "Private internal C extensions",
      "Deprecated functions",
      "Thread hooks"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "Dunder Methods & Protocols",
    explanation: "Dunder methods allow custom classes to hook into Python syntax protocols (e.g. + operator, len(), iteration, string representations)."
  },
  {
    id: 87,
    language: "PYTHON",
    text: "What is Monkey Patching in Python?",
    options: [
      "Dynamically updating or overriding attributes/methods of a module or class at runtime without altering source code",
      "Fixing syntax errors automatically",
      "Installing packages using pip",
      "Converting Python 2 code to Python 3"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "Monkey Patching",
    explanation: "Monkey patching refers to dynamically modifying classes or modules at runtime (often used in unit tests or gevent mocking)."
  },
  {
    id: 88,
    language: "PYTHON",
    text: "What is the C3 Linearization algorithm used for in Python?",
    options: [
      "Calculating MRO (Method Resolution Order) in multiple inheritance hierarchies without breaking monotonicity",
      "Sorting dictionary keys in linear time",
      "Garbage collection cycle detection",
      "JIT compilation pass"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "C3 Linearization",
    explanation: "C3 Linearization computes a deterministic, consistent MRO order for complex multiple inheritance trees in Python 2.3+."
  },
  {
    id: 89,
    language: "PYTHON",
    text: "What does asyncio event loop do in Python asynchronous programming?",
    options: [
      "Manages non-blocking I/O operations and coroutines by scheduling execution tasks on a single thread",
      "Creates multi-core OS processes",
      "Compiles Python to machine bytecode",
      "Cleans heap memory"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "Asyncio & Event Loop",
    explanation: "The asyncio event loop runs async tasks and coroutines, handling cooperative multitasking over non-blocking socket and I/O streams."
  },
  {
    id: 90,
    language: "PYTHON",
    text: "What is the purpose of functools.wraps decorator when writing custom decorators?",
    options: [
      "Preserves the original wrapped function's docstring, name, and metadata",
      "Speeds up function execution speed",
      "Turns functions into async coroutines",
      "Enforces strict type annotations"
    ],
    correctOptionIndex: 0,
    difficulty: "HARD",
    topic: "Functools & Wraps",
    explanation: "@functools.wraps(func) copies metadata like __name__ and __doc__ from the decorated function onto the wrapper function."
  }
];

export const DEFAULT_QUIZ_SETTINGS = {
  questionsPerRound: 10,
  timePerQuestionSec: 30,
  marksPerQuestion: 4,
  negativeMarks: 1,
  allowNegativeMarking: true,
  strictAntiCheat: true,
  passingPercentage: 60,

  // Certificate Signatory & Template Customization
  collegeName: "ADITYA UNIVERSITY",
  departmentName: "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING",
  certTitle: "CERTIFICATE OF MERIT",
  certBodyText: "for successfully passing the official online assessment in",
  
  // Project Mentor Details
  mentorName: "SK. VAHIDA",
  mentorTitle: "SK. VAHIDA, M.Tech(Ph.D)",
  mentorRole: "Assistant Professor & Project Mentor",

  // HOD Details
  hodName: "Dr. K. Srinivasa Rao",
  hodTitle: "Dr. K. Srinivasa Rao, Ph.D",
  hodRole: "Head of Department (CSE)"
};
