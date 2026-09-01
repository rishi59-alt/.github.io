import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { PageContainer } from "@/components/PageContainer";
import { TacticSolver } from "@/components/TacticSolver";
import { Skeleton } from "@/components/ui/skeleton";

export default function TacticTrainer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tactic, setTactic] = useState(null);
  const [all, setAll] = useState([]);

  useEffect(() => {
    let active = true;
    api.get(`/tactics/${id}`).then(({ data }) => { if (active) setTactic(data); }).catch(() => {});
    api.get(`/tactics`).then(({ data }) => { if (active) setAll(data); }).catch(() => {});
    return () => { active = false; };
  }, [id]);

  const goNext = () => {
    if (!all.length) return;
    const i = all.findIndex((t) => t.id === id);
    const nxt = all[(i + 1) % all.length];
    navigate(`/tactics/${nxt.id}`);
  };

  if (!tactic) {
    return <PageContainer><Skeleton className="h-8 w-40" /><Skeleton className="mt-4 h-96 w-full max-w-xl" /></PageContainer>;
  }

  return (
    <PageContainer>
      <Link to="/tactics" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All tactics
      </Link>
      <TacticSolver key={tactic.id} tactic={tactic} onNext={goNext} nextLabel="Next Tactic" />
    </PageContainer>
  );
}
