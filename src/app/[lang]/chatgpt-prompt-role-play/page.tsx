"use client";

import React, { useEffect, useState } from "react";
import { Heading, Input, Text } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable/DataTable";
import { LinkIcon } from "@chakra-ui/icons";
import CopyComponent from "@/components/CopyComponent";
import parseCsv from "@/data-processor/CsvParser";
import Highlight from "@/components/Highlight";
import prompts from "@/assets/resources/prompts.json";
import promptsCn from "@/assets/resources/prompts_cn.json";

type ActPrompt = {
  act: string;
  prompt: string;
  icon: string;
};

const columnHelper = createColumnHelper<ActPrompt>();

const genColumns = (highlight: string) => [
  columnHelper.accessor("act", {
    cell: (info) => <Highlight value={info.getValue()} keyword={highlight} />,
    header: "act",
  }),
  columnHelper.accessor("prompt", {
    cell: (info) => <Highlight value={info.getValue()} keyword={highlight} />,
    header: "prompt",
  }),
  columnHelper.accessor("prompt", {
    id: "icon",
    cell: (info) => CopyComponent({ value: info.getValue() }),
    header: "copy",
  }),
];

type Prompts = { act: string; prompt: string }[];

function ChatGptPromptList() {
  const [data, setData] = useState<Prompts>([]);
  const [search, setSearch] = useState<string>("");
  useEffect(() => {
    // read local json data
    let localData = true;
    if (!localData) {
      // request remote data
      fetch("https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv")
        .then((response) => response.text())
        .then((csv) => {
          const parseResult = parseCsv(csv);

          if (parseResult.errors.length === 0) {
            setData(parseResult.data as Prompts);
          } else {
            setData([]);
            throw new Error("parse csv error: " + parseResult.errors.join(","));
          }
        });
    } else {
      // read local json data
      let promptsConcat = promptsCn.concat(prompts);
      console.log(promptsConcat.length)
      if (promptsConcat.length > 0) {
        console.log(promptsConcat);
        setData(promptsConcat as Prompts);
        // console.log(Prompts);
      } else {
        setData([]);
        throw new Error("parse csv error: " + promptsConcat.join(","));
      }
    }

  }, []);

  return (
    <div>
      <Heading></Heading>
      <Input placeholder='Search' value={search} onChange={(ev) => setSearch(ev.target.value)} />
      <Text>
        base on:
        <a href={"https://github.com/f/awesome-chatgpt-prompts"}>
          awesome-chatgpt-prompts <LinkIcon />
        </a>
        <a href={"https://github.com/PlexPt/awesome-chatgpt-prompts-zh"}>
          awesome-chatgpt-prompts-zh <LinkIcon />
        </a>
      </Text>
      {data && (
        <DataTable
          data={data.filter(
            (it) => (it.act != undefined && it.act.includes(search)) || (it.prompt != undefined && it.prompt.includes(search))
          )}
          columns={genColumns(search) as any}
        />
      )}
    </div>
  );
}

export default ChatGptPromptList;
