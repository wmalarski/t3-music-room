module.exports = (plop) => {
  plop.setHelper("basename", (txt) => txt.split("/").at(-1));

  plop.setGenerator("component", {
    description: "React.js Component",
    prompts: [
      {
        type: "list",
        name: "export",
        choices: ["named", "default"],
        default: "named",
        message: "Export type",
      },
      {
        type: "input",
        name: "path",
        message: "Component path",
      },
    ],
    actions: (args) => [
      {
        type: "addMany",
        destination: "src/{{path}}",
        base: ".templates/component",
        templateFiles: ".templates/component/*.hbs",
        data: { isDefaultExport: args.export === "default" },
      },
    ],
  });
};
