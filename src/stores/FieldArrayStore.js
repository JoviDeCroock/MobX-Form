// Store for our FieldArrays, let's build this starting from reasoning and tests

// A FieldArray is actually a way to construct an array of Values or an Array of Objects.
// fieldArray = ["x", "y"] ==> VALID ==> Probably won't look like this unless we can catch that there's only one Field within the Array.
// fieldArray = [{ name: "x", age: 22 }, { name: "y", age: 23 }] ==> ALSO VALID

// My suggested approach is to make objects either way.
// So the fieldArray will probably always look like this --> [{ <fieldId>: <value>,... },...]

// Ideally every member is a Field or a component with our change function on it.
// We will have to render the set of Fields everytime an object gets pushed on the FieldArray.
// We have to make sure that the Field and FieldArray aren't persisting double data to avoid FieldArray being expensive.
