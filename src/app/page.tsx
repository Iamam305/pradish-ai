"use client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Skeleton,
  Image,
  Code,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Fuse from "fuse.js";
import Link from "next/link";

export default function Home() {
  const { isLoading, error, data } = useQuery("repoData", () =>
    fetch("/api/projects").then((res) => res.json())
  );
  console.log(data);
  const pathname = usePathname();
  return (
    <>
      <div className="max-w-[1024px] mx-auto flex w-full gap-8 justify-center items-center mt-24">
        <Input
          size="sm"
          isClearable
          radius="sm"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focused=true]:bg-default-200/50",
              "dark:group-data-[focused=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          placeholder="Type to search..."
          startContent={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          }
        />
        <Button
          color="primary"
          size="lg"
          startContent={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        >
          Add New
        </Button>
      </div>
      {isLoading && (
        <>
          <div className="max-w-[1024px] mx-auto flex justify-left items-stretch flex-wrap gap-4 mt-10">
            <Skeleton isLoaded={isLoading} className="rounded-lg">
              <div className="max-w-[300px] h-24 rounded-lg bg-secondary"></div>
            </Skeleton>

            <Skeleton isLoaded={isLoading} className="rounded-lg">
              <div className="max-w-[300px] h-24 rounded-lg bg-secondary"></div>
            </Skeleton>

            <Skeleton isLoaded={isLoading} className="rounded-lg">
              <div className="max-w-[300px] h-24 rounded-lg bg-secondary"></div>
            </Skeleton>
          </div>
        </>
      )}

      {data && (
        <div className="max-w-[1024px] mx-auto flex justify-left items-stretch flex-wrap gap-4 mt-10">
          {data?.projects.map((project: any) => (
            <Card className="max-w-[330px]" key={project._id}>
              <CardHeader className="flex justify-between">
                <div className="flex flex-col">
                  <p className="text-md">{project.fileName}</p>
                  <p className="text-small text-default-500">12/12/12</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <pre className=" text-gray-600 dark:text-gray-300 whitespace-pre-wrap bg-black p-4 rounded-md">
                  {`<iframe>${window.location.href}chat/${project._id}</iframe>`}
                </pre>
              </CardBody>
              <Divider />
              <CardFooter className="justify-between">
                <p className="text-small text-default-500">
                  {project.fileType}
                </p>
                <Button color="primary">
                  <Link href={`/chat/${project._id}`}>Demo</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
// fileKey
// :
// "uploads/1701520793107(2)-Final Good Habits - Website Content 28th October 2023.pdf"
// fileLocation
// :
// "no file location"
// fileName
// :
// "(2) Final Good Habits - Website Content 28th October 2023.pdf"
// fileType
// :
// "application/pdf"
// userId
// :
// "user_2YwBvslcps3Yj1sMbSYsftqE0t0"
// __v
// :
// 0
// _id
// :
// "656b25991e283789a3b0fe60"
