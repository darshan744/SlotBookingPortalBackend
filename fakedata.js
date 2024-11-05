const { faker } = require('@faker-js/faker'); // Correct import statement

const departments = ['ECE', 'CSE', 'IT', 'EEE'];
const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4'];
const studentData = [];

function generateStudent(department, year, rollNumber) {
  // Generate a full name and remove any potential prefixes like Mr., Mrs.
  const name = faker.person.fullName(); 
  const cleanName = name.replace(/^(Mr|Mrs|Dr|Prof)\.?\s+/i, ''); // Remove any title prefixes like Mr., Mrs., Dr., Prof.

  const dob = faker.date.past(20, new Date(2003, 0, 1)); // Random birthdate for students (between 2000-2003)
  const day = String(dob.getDate()).padStart(2, '0'); // Ensure 2-digit day
  const month = String(dob.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
  const yearOfBirth = dob.getFullYear(); // Full year of birth (e.g., 2003, 2024, etc.)
  const shortYearOfBirth = yearOfBirth.toString().slice(2, 4); // Short format (e.g., '03', '24')

  const departmentShort = department.slice(0, 2).toUpperCase(); // Get the first 2 letters of department
  
  // Constructing student ID with the correct format
  const studentId = `7376${shortYearOfBirth}1${departmentShort}${rollNumber.toString().padStart(3, '0')}`; 
  
  // Format email: first and last names, department, and year of joining
  const emailParts = cleanName.split(' ');
  const email = `${emailParts[0].toLowerCase()}${emailParts[1] ? emailParts[1].toLowerCase() : ''}.${department.toLowerCase()}${shortYearOfBirth}@bitsathy.ac.in`;

  // Create password in 'ddmmyy' format (representing the date of birth)
  const password = `${day}${month}${shortYearOfBirth}`; // Format: ddmmyy

  // Create resume link with clean name
  const resume = `${emailParts[0]}${emailParts[1] ? emailParts[1] : ''}_resume`;

  return {
    studentId,
    name: cleanName,
    department,
    year,
    password, // Password now in 'ddmmyy' format (representing date of birth)
    resume,
    email,
    EventHistory: [] // EventHistory is empty as requested
  };
}

// Generate 200 students
for (let i = 0; i < 200; i++) {
  const department = departments[i % departments.length];
  const year = years[i % years.length];
  const rollNumber = 101 + (i % 100); // Roll number will vary between 101 and 200
  const student = generateStudent(department, year, rollNumber);
  studentData.push(student);
}

console.log(JSON.stringify(studentData, null, 2));
