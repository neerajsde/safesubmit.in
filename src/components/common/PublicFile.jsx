"use client";
import React, { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks/hook";
import Loader from "../spinner/Loader";
import Spinner from "../spinner/Spinner";

const PublicFile = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  const params = useParams();
  const filename = Array.isArray(params?.fileurl) ? params.fileurl[1] : params?.fileurl;

  useEffect(() => {
    if((params.fileurl[0] !== "files") || !filename){
      setError('Invaild url');
      return;
    }

    const loadFile = async () => {
      try {
        setFetching(true);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Unauthorized");

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/file?filename=${filename}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("File Not Found");
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
        setFileType(blob.type);
      } catch (error) {
        setError(error.message)
      } finally {
        setFetching(false);
      }
    };

    loadFile();
  }, [filename]);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  if(fetching){
    return (
      <div className="w-full min-h-[90vh] flex items-center justify-center">
        <Spinner/>
      </div>
    )
  }

  if(error){
    return (
      <div className="w-full min-h-[90vh] flex items-center justify-center">
        {error}
      </div>
    )
  }

  const renderFile = () => {
    if (!fileUrl || !fileType) return (
      <div>File Not Found!!</div>
    );

    if (fileType.startsWith("image/")) {
      return <img src={fileUrl} alt="file" className="max-w-full h-auto" />;
    } else if (fileType === "application/pdf") {
      return <iframe src={fileUrl} className="w-full h-[90vh]" />;
    } else if (fileType.startsWith("video/")) {
      return (
        <video controls className="max-w-full">
          <source src={fileUrl} type={fileType} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (fileType.startsWith("audio/")) {
      return (
        <audio controls>
          <source src={fileUrl} type={fileType} />
          Your browser does not support the audio element.
        </audio>
      );
    } else {
      return (
        <a
          href={fileUrl}
          download={filename}
          className="text-blue-500 underline"
        >
          Download File
        </a>
      );
    }
  };

  return (
    <div className="p-8 w-full flex flex-col justify-center items-center">
      <h1 className="text-lg font-semibold mb-4">Public File Viewer</h1>
      {renderFile()}
    </div>
  );
};

export default PublicFile;
