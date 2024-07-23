import cuid from "cuid";
import user_0 from "./assets/images/user_0.svg";
import user_1 from "./assets/images/user_1.svg";
import user_3 from "./assets/images/user_3.svg";

export const suggestionList = [
  {
    id: "0",
    upvotes: 112,
    title: "Add tags for solutions",
    details: "Easier to search for solutions based on a specific stack.",
    tag: "Enhancement",
    upvotedByMe: false,
    status: "Planned",
    comments: { quantity: 0, commentList: [] },
  },
  {
    id: "1",
    upvotes: 99,
    title: "Add a dark theme option",
    details: "It would help people with light sensitivities and who prefer dark mode.",
    tag: "Feature",
    upvotedByMe: false,
    status: "Planned",
    comments: {
      quantity: 7,
      commentList: [
        {
          img: user_0,
          userName: "Elijah Moss",
          userId: "@hexagon.bestagon",
          commentId: "0",
          children: [],
          content:
            "Also, please allow styles to be applied based on system preferences.I would love to be able to browse Frontend Mentor in the evening after my device’s dark mode turns on without the bright background it currently has.",
        },
        {
          img: user_1,
          userName: "James Skinner",
          userId: "@hummingbird1",
          commentId: "1",
          children: [
            {
              img: user_0,
              userName: "Anne Valentine",
              userId: "@annev1990",
              commentId: "2",
              parentId: "1",
              content:
                '@hummingbird1 While waiting for dark mode, there are browser extensions that will also do the job. Search for "dark theme” followed by your browser. There might be a need to turn off the extension for sites with naturally black backgrounds though.',
            },
            {
              img: user_3,
              userName: "Ryan Welles",
              userId: "@voyager.344",
              commentId: "3",
              parentId: "1",
              content:
                "@annev1990  Good point! Using any kind of style extension is great and can be highly customizable, like the ability to change contrast and brightness. I'd prefer not to use one of such extensions, however, for security and privacy reasons.",
            },
          ],
          content:
            "Second this! I do a lot of late night coding and reading. Adding a dark theme can be great for preventing eye strain and the headaches that result. It’s also quite a trend with modern apps and apparently saves battery life.",
        },
        {
          img: user_0,
          userName: "Elijah Moss",
          userId: "@hexagon.bestagon",
          commentId: "4",
          children: [],
          content:
            "Also, please allow styles to be applied based on system preferences.I would love to be able to browse Frontend Mentor in the evening after my device’s dark mode turns on without the bright background it currently has.",
        },
        {
          img: user_0,
          userName: "Elijah Moss",
          userId: "@hexagon.bestagon",
          commentId: "5",
          children: [],
          content:
            "Also, please allow styles to be applied based on system preferences.I would love to be able to browse Frontend Mentor in the evening after my device’s dark mode turns on without the bright background it currently has.",
        },
        {
          img: user_0,
          userName: "Elijah Moss",
          userId: "@hexagon.bestagon",
          commentId: "6",
          children: [],
          content: "Also, please allow styles",
        },
      ],
    },
  },
  {
    id: "2",
    upvotes: 65,
    title: "Q&A within the challenge hubs",
    details: "Challenge-specific Q&A would make for easy reference.",
    tag: "Feature",
    upvotedByMe: false,
    status: "In-Progress",
    comments: { quantity: 0, commentList: [] },
  },
  {
    id: "3",
    upvotes: 51,
    title: "Allow image/video upload to feedback",
    details: "Images and screencasts can enhance comments on solutions.",
    tag: "Enhancement",
    upvotedByMe: false,
    status: "In-Progress",
    comments: { quantity: 0, commentList: [] },
  },
  {
    id: "4",
    upvotes: 42,
    title: "Ability to follow others",
    details: "Stay updated on comments and solutions other people post.",
    tag: "Feature",
    upvotedByMe: false,
    status: "In-Progress",
    comments: { quantity: 0, commentList: [] },
  },
  {
    id: "5",
    upvotes: 3,
    title: "Preview images not loading",
    details: "Challenge preview images are missing when you apply a filter.",
    tag: "Bug",
    upvotedByMe: false,
    status: "Live",
    comments: { quantity: 0, commentList: [] },
  },
];
