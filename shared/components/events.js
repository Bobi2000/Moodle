const now = new Date();

export default [
  {
    id: 0,
    title: "Exam",
    allDay: true,
    start: new Date(),
    end: new Date()
  },
  {
    id: 1,
    title: "Exam 2",
    allDay: true,
    start: new Date().setDate(new Date().getDate() + 1),
    end: new Date().setDate(new Date().getDate() + 1),
  },
  {
    id: 2,
    title: "Exam 3",
    allDay: true,
    start: new Date().setDate(new Date().getDate() + 4),
    end: new Date().setDate(new Date().getDate() + 5),
  },
];
