export const dummyCensusRecords = [
  {
    firstName: 'Jane',
    lastName: 'Doe',
    idNumber: '12345678',
    dateOfBirth: '1990-05-15',
    gender: 'female',
    maritalStatus: 'married',
    county: 'Nairobi',
    subCounty: 'Westlands',
    ward: 'Parklands',
    education: 'degree',
    employment: 'employed',
    occupation: 'Teacher',
    householdSize: 4,
    householdMembers: [
      { name: 'John Doe', age: 35, gender: 'male', relationship: 'spouse', education: 'degree', occupation: 'Engineer', hasDisability: 'no', disabilityType: '' },
      { name: 'Emily Doe', age: 10, gender: 'female', relationship: 'child', education: 'primary', occupation: '', hasDisability: 'no', disabilityType: '' },
      { name: 'Michael Doe', age: 7, gender: 'male', relationship: 'child', education: 'primary', occupation: '', hasDisability: 'yes', disabilityType: 'Visual impairment' }
    ]
  },
  // ... other records
];

export function getSummary(records) {
  // ... getSummary function
}

export function getGenderData(records) {
  // ... getGenderData function
}

export function getAgeData(records) {
  // ... getAgeData function
}

export function getEducationData(records) {
  // ... getEducationData function
}

export function getEmploymentData(records) {
  // ... getEmploymentData function
}

export function getCountyData(records) {
  // ... getCountyData function
} 