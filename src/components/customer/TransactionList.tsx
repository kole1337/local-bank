import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { transactionTypeMeta } from "@/lib/status";

type Transaction = {
  id: string;
  type: keyof typeof transactionTypeMeta;
  amountCents: number;
  description: string;
  counterparty: string | null;
  createdAt: Date | string;
};

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="p-10 text-center text-sm text-muted-foreground">
        No transactions yet.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {transactions.map((tx) => {
        const meta = transactionTypeMeta[tx.type];
        const isCredit = meta.direction === "in";
        return (
          <li key={tx.id} className="flex items-center gap-4 px-5 py-4">
            <span
              className={
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full " +
                (isCredit ? "bg-accent text-accent-foreground" : "bg-surface-muted text-muted-foreground")
              }
            >
              {isCredit ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{tx.description}</p>
              <p className="text-xs text-muted-foreground">
                {meta.label}
                {tx.counterparty ? ` · ${tx.counterparty}` : ""} · {formatDate(tx.createdAt)}
              </p>
            </div>
            <span className={"shrink-0 text-sm font-semibold " + (isCredit ? "text-primary" : "text-foreground")}>
              {isCredit ? "+" : "-"}
              {formatCurrency(Math.abs(tx.amountCents))}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
