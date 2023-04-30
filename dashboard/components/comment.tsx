import { CommentFragment } from "@lens-protocol/api-bindings";
import {
  BarChart,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Focus,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import DynamicReactJson from "./dynamic-react-json";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
("lucide-react");

export default function Comment({ comment }: { comment: CommentFragment }) {
  const overviewItems = [
    { label: "Id", value: comment.id },
    { label: "Name", value: comment.metadata.name },
    { label: "Type", value: comment.__typename },
    { label: "CreatedAt At", value: comment.createdAt },
    { label: "Collect Policy", value: comment.collectPolicy || "-" },
    { label: "Reference Policy", value: comment.referencePolicy || "-" },
    { label: "Collect Module", value: comment.__collectModule },
    { label: "Mirrors", value: comment.mirrors || "-" },
    { label: "Reaction", value: comment.reaction || "-" },
    { label: "Collected By", value: comment.collectedBy?.address || "-" },
    { label: "Decryption Criteria", value: comment.decryptionCriteria || "-" },
  ];

  const checkItems = [
    { label: "Can Comment", value: comment.canComment.result },
    { label: "Can Mirror", value: comment.canMirror.result },
    { label: "Can Observer Decrypt", value: comment.canObserverDecrypt.result },
    { label: "Hidden", value: comment.hidden },
    { label: "Is Gated", value: comment.isGated },

    { label: "Has Collected By Me", value: comment.hasCollectedByMe },
    {
      label: "Has Optimistic Collected By Me",
      value: comment.hasOptimisticCollectedByMe,
    },
    {
      label: "Is Optimistic Mirrored By Me",
      value: comment.isOptimisticMirroredByMe,
    },
  ];

  return (
    <div className="flex flex-col space-y-7 py-7">
      <div className="flex flex-col space-y-2">
        <div className="text-2xl font-bold text-gray-800 flex items-center">
          <span>Publication</span>
          <span className="ml-2 font-mono">{comment.id}</span>
        </div>
        <div className="font-bold text-gray-600 text-sm">
          <Badge>{comment.__typename}</Badge>
          <span> @ </span>
          <Link
            href={`/profile/${comment.profile.handle}`}
            className="font-bold underline underline-offset-4"
          >
            {comment.profile.handle}
          </Link>
        </div>
        <div className="flex flex-col space-y-1 ml-1">
          <span className="text-sm">Comment On</span>
          <Link
            className="font-mono underline underline-offset-4"
            href={`/publication/${comment.commentOn?.id}`}
          >
            {comment.commentOn?.id || "-"}
            {(comment.commentOn as any).metadata &&
              ` (${((comment.commentOn as any).metadata as any).name})`}
          </Link>
        </div>
        <div className="flex flex-col space-y-1 ml-1">
          <span className="text-sm">Main Post</span>
          <Link
            className="font-mono underline underline-offset-4"
            href={`/publication/${comment.mainPost?.id}`}
          >
            {comment.mainPost?.id || "-"}
            {(comment.mainPost as any).metadata &&
              ` (${((comment.mainPost as any).metadata as any).name})`}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Overview</CardTitle>
            <Focus />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {overviewItems.map((item, index) => (
              <div key={index} className="flex flex-col space-y-1 font-medium">
                <span className="text-sm text-gray-600 uppercase">
                  {item.label}
                </span>
                <span>
                  {typeof item.value === "object" ? (
                    <DynamicReactJson
                      name={false}
                      collapsed={true}
                      displayDataTypes={false}
                      src={item.value || {}}
                    />
                  ) : (
                    item.value
                  )}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Stats</CardTitle>
            <BarChart />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {Object.entries(comment.stats)
              .filter(([key]) => !key.startsWith("__"))
              .map(([key, value]) => (
                <div key={key} className="flex flex-col space-y-1 font-medium">
                  <span className="text-sm text-gray-600 uppercase">
                    {key
                      .replace(/^total/, "")
                      .replace(/([a-z])([A-Z])/g, "$1 $2")}
                  </span>
                  <span>{value}</span>
                </div>
              ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Checks</CardTitle>
            <ClipboardCheck />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {checkItems.map((item, index) => (
              <div key={index} className="flex flex-col space-y-1 font-medium">
                <span className="text-sm text-gray-600 uppercase">
                  {item.label}
                </span>
                <span className="flex flex-row items-center space-x-2">
                  {typeof item.value === "boolean" ? (
                    item.value ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )
                  ) : (
                    item.value
                  )}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Metadata</CardTitle>
            <FileText />
          </CardHeader>
          <CardContent className="overflow-auto">
            {/* <Metadata metadata={comment.metadata} /> */}
            <DynamicReactJson
              name={false}
              displayDataTypes={false}
              src={comment.metadata}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
