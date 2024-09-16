"use client";
import { useSetAtom } from "jotai";
import NextLink, { type LinkProps } from "next/link";
import { type ReactNode } from "react";
import { loadingAtom } from "~/atoms/loading";
import { shouldTriggerStartEvent } from "~/lib/shouldTriggerStartEvent";

function Link(props: LinkProps & { children?: ReactNode; className?: string }) {
  const setLoading = useSetAtom(loadingAtom);

  return (
    <NextLink
      onClick={(e) => {
        shouldTriggerStartEvent(props.href.toString(), e) && setLoading(true);
      }}
      {...props}
    />
  );
}

export default Link;
