import prompts from "prompts";
import type { PackInput } from "./createManifest";

export async function promptPackInfo(): Promise<PackInput> {
  const response = await prompts(
    [
      {
        type: "text",
        name: "id",
        message: "Pack ID",
        initial: "t###",
        validate: (v) => (v ? true : "ID is required"),
      },
      {
        type: "text",
        name: "title",
        message: "Pack title",
        initial: "Topik # - #00",
      },
      {
        type: "select",
        name: "level",
        message: "Level",
        choices: [
          { title: "TOPIK I", value: "1" },
          { title: "TOPIK II", value: "2" },
        ],
      },
      {
        type: "number",
        name: "version",
        message: "Version",
        initial: 1,
        min: 1,
      },
      {
        type: "text",
        name: "author",
        message: "Author",
        initial: "Tokki Korean",
      },
    ],
    {
      onCancel: () => {
        console.log("\n Manifest creation cancelled.");
        process.exit(1);
      },
    }
  );

  return response as PackInput;
}
