"use client";

import { useContext, useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { DictionaryContext } from "@/shared/components/Dictionary";
import { ExpenseGoal } from "../../actions";
import { GoalStatus } from "../../types";
import DestroyButton from "../destroy-goal/DestroyButton";

interface Props {
  readonly expensesGoal: ExpenseGoal;
}

export default function ExpensesGoalProgress({ expensesGoal }: Props) {
  const { locale } = useContext(DictionaryContext);

  const value = useMemo(() => {
    return (expensesGoal.total * 100) / expensesGoal.moneyAmount;
  }, [expensesGoal]);

  const expired = useMemo(() => {
    const today = new Date();
    const expired = today.getTime() > expensesGoal.endDate.getTime();
    return expired;
  }, [expensesGoal]);

  const status = useMemo((): GoalStatus => {
    if (expired) {
      return expensesGoal.total <= expensesGoal.moneyAmount
        ? { text: "Goal met ✅", style: "default" }
        : { text: "Failed 😞", style: "destructive" };
    }

    return expensesGoal.total <= expensesGoal.moneyAmount
      ? { text: "In progress ⌛", style: "secondary" }
      : { text: "Failed 😞", style: "destructive" };
  }, [expensesGoal, expired]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{expensesGoal.type}</CardTitle>
        <CardDescription>
          <p>
            {expensesGoal.startDate.toLocaleDateString(locale, {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }) +
              " - " +
              expensesGoal.endDate.toLocaleDateString(locale, {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Field className="w-full max-w-sm">
          <FieldLabel htmlFor="progress">
            <span className="ml-auto">{`${expensesGoal.total}/${expensesGoal.moneyAmount}`}</span>
          </FieldLabel>
          <Progress value={Math.min(value, 100)} id="progress" />
        </Field>
      </CardContent>
      <CardFooter className="flex justify-between gap-8">
        <Badge variant={status.style}>{status.text}</Badge>
        <DestroyButton id={expensesGoal.id} currency={expensesGoal.currency} />
      </CardFooter>
    </Card>
  );
}
