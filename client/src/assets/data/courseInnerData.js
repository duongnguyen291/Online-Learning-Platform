// Course data structure
export const courseData = {
  title: "Embedded Hardware and Operating Systems",
  chapters: [
    {
      id: "chapter1",
      title: "Chapter 1: Input/Output",
      completed: true,
      lessons: [
        { id: "lesson1-1", title: "Input/Output Devices", type: "Video", duration: "7 min", completed: true },
        { id: "lesson1-2", title: "Build your own input/output system", type: "Reading", duration: "7 min", completed: false },
        { id: "lesson1-3", title: "Wire communication, ADC/DAC", type: "Video", duration: "7 min", completed: false },
        { id: "lesson1-4", title: "Build your own ADC", type: "Video", duration: "7 min", completed: false },
        { id: "lesson1-5", title: "Sensor, actuators, interrupts vs. polling", type: "Video", duration: "7 min", completed: false }
      ]
    },
    {
      id: "chapter2",
      title: "Chapter 2: Microcontrollers",
      completed: false,
      lessons: [
        { id: "lesson2-1", title: "Introduction to Microcontrollers", type: "Video", duration: "8 min", completed: false },
        { id: "lesson2-2", title: "Arduino Programming Basics", type: "Reading", duration: "10 min", completed: false },
        { id: "lesson2-3", title: "GPIO and Digital Logic", type: "Video", duration: "9 min", completed: false }
      ]
    },
    {
      id: "chapter3",
      title: "Chapter 3: Real-time Operating Systems",
      completed: false,
      lessons: [
        { id: "lesson3-1", title: "RTOS Fundamentals", type: "Video", duration: "12 min", completed: false },
        { id: "lesson3-2", title: "Task Scheduling", type: "Reading", duration: "9 min", completed: false },
        { id: "lesson3-3", title: "Memory Management", type: "Video", duration: "10 min", completed: false }
      ]
    }
  ]
};