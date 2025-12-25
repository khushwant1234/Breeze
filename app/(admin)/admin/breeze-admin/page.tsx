import { prisma } from "@/lib/prisma";
import TransactionTable from "./transaction-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Page() {
  const merchItemsArray = await prisma.merchItem.findMany();
  const eventItemsArray = await prisma.eventItem.findMany();

  const merchItems = new Map(
    merchItemsArray.map((item) => {
      const { id, ...rest } = item;
      return [id, rest];
    })
  );

  const eventItems = new Map(
    eventItemsArray.map((item) => {
      const { id, ...rest } = item;
      return [id, rest];
    })
  );

  const pendingTransactions = await prisma.submittedTransaction.findMany({
    where: {
      approved: false,
      rejected: false,
    },
  });

  const rejectedTransactions = await prisma.submittedTransaction.findMany({
    where: { rejected: true },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Transaction Management</h1>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending">
            Pending ({pendingTransactions.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedTransactions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <TransactionTable
            transactions={pendingTransactions}
            eventMap={eventItems}
            merchMap={merchItems}
            showActions={true}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <TransactionTable
            transactions={rejectedTransactions}
            eventMap={eventItems}
            merchMap={merchItems}
            showActions={false}
            isRejected={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const dynamic = "force-dynamic";
