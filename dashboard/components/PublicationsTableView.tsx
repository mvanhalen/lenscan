import { trpc } from "@/lib/trpc";
import { age, shortHash } from "@/lib/utils";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { ethers } from "ethers";
import Link from "next/link";
import { useState } from "react";
import Pagination from "./Pagination";
import { Loading } from "./loading";
import { Badge } from "./ui/badge";

export default function PublicationsTableView({
  showPagination = true,
  itemsPerPage = 25,
}) {
  const [cursor, setCursor] = useState(null);
  const { data, error, isLoading } = trpc.event.getPublications.useQuery({
    take: itemsPerPage,
    cursor,
  });

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <Loading fixed={false} />;

  return (
    <div className="mt-6">
      <div className="flex flex-col justify-between space-y-7 pb-7">
        <h2 className="text-3xl font-bold tracking-tight">Publications</h2>
      </div>
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Id</TableHeaderCell>
              <TableHeaderCell>Profile Id</TableHeaderCell>
              <TableHeaderCell>block</TableHeaderCell>
              <TableHeaderCell>Age</TableHeaderCell>
              <TableHeaderCell>Txn Hash</TableHeaderCell>
              <TableHeaderCell>type</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.events.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Link
                    href={`/publication/${ethers.utils.hexlify(
                      (item.data as any)?.ProfileId
                    )}-${ethers.utils.hexlify((item.data as any)?.PubId)}`}
                    className="font-medium underline underline-offset-4"
                  >
                    {ethers.utils.hexlify((item.data as any)?.ProfileId)}-
                    {ethers.utils.hexlify((item.data as any)?.PubId)}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/profile/${ethers.utils.hexlify(
                      (item.data as any)?.ProfileId
                    )}`}
                    className="font-medium underline underline-offset-4"
                  >
                    {(item.data as any)?.ProfileId || "-"}
                  </Link>
                </TableCell>

                <TableCell>
                  <Link
                    href={`https://polygonscan.com/block/${item.blockNumber}`}
                    target="_blank"
                    className="font-medium underline underline-offset-4"
                  >
                    {Number(item.blockNumber)}
                  </Link>
                </TableCell>
                <TableCell>{age(Number(item.timestamp))}</TableCell>
                <TableCell>
                  <Link
                    href={`https://polygonscan.com/tx/${item.txHash}`}
                    target="_blank"
                    className="font-medium underline underline-offset-4"
                  >
                    {shortHash(item.txHash!)}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={"outline"}>{item.type}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {showPagination && (
        <Pagination
          curCursor={cursor}
          nextCursor={data.nextCursor}
          resultsPerPage={itemsPerPage}
          setCursor={setCursor}
        />
      )}
    </div>
  );
}
