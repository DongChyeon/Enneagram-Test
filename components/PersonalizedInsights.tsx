'use client';

import { useEffect, useMemo, useState } from 'react';

import { questions } from '../data/questions';
import { counterSignals, facetKindLabels } from '../data/result-insights';
import type { FacetKind, Question, TypeId } from '../data/schema';
import { facets, typeById } from '../data/types';
import { TYPE_IDS } from '../lib/scoring';
import type { Likert, Result } from '../lib/types';
import { readAnswerProfile, type AnswerSlot } from './progress';

function contribution(question: Question, value: Likert): number {
  return question.reverse ? 6 - value : value;
}

function rankedTypes(result: Result): TypeId[] {
  return [...TYPE_IDS].sort((a, b) => result.scores[b] - result.scores[a] || a - b);
}

export function PersonalizedInsights({ result, code }: { result: Result; code: string }) {
  const ranking = rankedTypes(result);
  const [first, second, third] = ranking;
  const firstType = typeById.get(first)!;
  const secondType = typeById.get(second)!;
  const thirdType = typeById.get(third)!;
  const [profile, setProfile] = useState<AnswerSlot[] | null>(null);

  useEffect(() => setProfile(readAnswerProfile(code, questions.length)), [code]);

  const facetProfile = useMemo(() => {
    if (result.kind !== 'full' || profile === null) return null;
    const rows = facets
      .filter((facet) => facet.typeId === first)
      .map((facet) => {
        const items = questions.filter((question) => question.facet === facet.id);
        const values = items.flatMap((question) => {
          const answer = profile[questions.indexOf(question)];
          return answer === null ? [] : [contribution(question, answer)];
        });
        return {
          ...facet,
          score: values.reduce((sum, value) => sum + value, 0) / values.length,
          items,
        };
      })
      .sort((a, b) => b.score - a.score);
    return rows.length === 5 ? rows : null;
  }, [first, profile, result.kind]);

  const evidence = useMemo(() => {
    if (profile === null) return null;
    return questions
      .map((question, index) => {
        const answer = profile[index];
        return answer === null ? null : { question, answer, score: contribution(question, answer) };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null && row.question.typeId === first)
      .sort((a, b) => b.score - a.score);
  }, [first, profile]);

  return (
    <section aria-labelledby="profile-heading" className="mt-14">
      <h2 id="profile-heading" className="text-[1.25rem] font-bold text-ink">내 점수 조합으로 읽어보기</h2>
      <div className="mt-5 rounded-card bg-sub p-5 sm:p-7">
        <p className="text-[1rem] font-bold leading-[1.6] text-ink">
          {first}유형이 가장 높고, {second}유형과 {result.scores[first] - result.scores[second]}점 차이예요.
        </p>
        <p className="mt-3 text-[0.9375rem] leading-[1.75] text-ink-soft">
          {firstType.nameKo}의 “{firstType.coreMotivation}” 경향이 가장 두드러졌어요. 동시에 {secondType.nameKo}의
          “{secondType.coreMotivation}” 경향도 가까이 나타났고, 세 번째 후보는 {third}유형 · {thirdType.nameKo}예요.
          한 유형의 설명에 자신을 전부 맞추기보다 세 유형의 차이를 함께 살펴보세요.
        </p>
      </div>

      <div className="mt-5 rounded-card border border-line p-5 sm:p-7">
        <h3 className="text-[1rem] font-bold text-ink">이 결과가 잘 맞지 않을 수 있는 신호</h3>
        <ul className="mt-3 space-y-2">
          {counterSignals[first].map((signal) => (
            <li key={signal} className="relative pl-4 text-[0.9375rem] leading-[1.7] text-ink-soft before:absolute before:left-0 before:top-[0.72em] before:h-1 before:w-1 before:rounded-full before:bg-ink-faint">
              {signal}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[0.8125rem] leading-[1.6] text-ink-faint">
          두 문장이 모두 더 가깝다면 1위 유형보다 2위와 3위 유형의 설명을 먼저 읽어보는 편이 좋아요.
        </p>
      </div>

      {facetProfile ? (
        <div className="mt-8">
          <h3 className="text-[1.0625rem] font-bold text-ink">90문항에서 나타난 세부 경향</h3>
          <div className="mt-4 space-y-3">
            {facetProfile.map((facet, index) => (
              <article key={facet.id} className="rounded-card bg-sub p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-bold text-ink">{facetKindLabels[facet.kind as FacetKind]}</h4>
                  <span className="text-[0.8125rem] font-bold text-ink-faint">{index === 0 ? '가장 두드러짐' : `${facet.score.toFixed(1)}/5`}</span>
                </div>
                <p className="mt-2 text-[0.875rem] leading-[1.7] text-ink-soft">{facet.description}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {evidence && evidence.length > 0 ? (
        <div className="mt-8 rounded-card border border-line p-5 sm:p-7">
          <h3 className="text-[1.0625rem] font-bold text-ink">이런 응답이 결과에 영향을 줬어요</h3>
          <div className="mt-4 space-y-4">
            {evidence.slice(0, 2).map(({ question, answer }) => (
              <div key={question.id}>
                <p className="text-[0.9375rem] leading-[1.7] text-ink-soft">“{question.text}”</p>
                <p className="mt-1 text-[0.8125rem] font-bold text-primary">{answer}점으로 답했어요</p>
              </div>
            ))}
            {evidence.at(-1) ? (
              <div className="border-t border-line pt-4">
                <p className="text-[0.8125rem] font-bold text-ink-faint">일반적인 설명과 달랐던 응답</p>
                <p className="mt-1.5 text-[0.9375rem] leading-[1.7] text-ink-soft">“{evidence.at(-1)!.question.text}”</p>
              </div>
            ) : null}
          </div>
          <p className="mt-4 text-[0.8125rem] leading-[1.6] text-ink-faint">이 응답 근거는 검사를 완료한 이 브라우저에서만 보여요. 공유 링크에는 포함되지 않아요.</p>
        </div>
      ) : null}

      {result.kind === 'base' && profile ? <ClarifyingQuestions result={result} profile={profile} /> : null}
    </section>
  );
}

function ClarifyingQuestions({ result, profile }: { result: Result; profile: AnswerSlot[] }) {
  const [first, second] = rankedTypes(result);
  const candidates = useMemo(() => {
    const chosen: Question[] = [];
    for (const typeId of [first, second]) {
      chosen.push(...questions.filter((question, index) => question.typeId === typeId && profile[index] === null).slice(0, 3));
    }
    return chosen;
  }, [first, profile, second]);
  const [answers, setAnswers] = useState<Record<string, Likert>>({});
  const complete = candidates.length === 6 && candidates.every((question) => answers[question.id] !== undefined);
  const winner = complete
    ? ([first, second] as TypeId[]).sort((a, b) => {
        const extra = (typeId: TypeId) => candidates.filter((q) => q.typeId === typeId).reduce((sum, q) => sum + contribution(q, answers[q.id]), 0);
        return (result.scores[b] + extra(b)) - (result.scores[a] + extra(a));
      })[0]
    : null;

  return (
    <div className="mt-8 rounded-card bg-primary-wash p-5 sm:p-7">
      <h3 className="text-[1.0625rem] font-bold text-ink">상위 두 유형을 조금 더 비교해 볼까요?</h3>
      <p className="mt-2 text-[0.875rem] leading-[1.7] text-ink-soft">아직 답하지 않은 {first}유형과 {second}유형 문항을 세 개씩 골랐어요. 유형을 확정하는 검사가 아니라 두 후보의 차이를 살펴보는 보조 질문이에요.</p>
      <div className="mt-5 space-y-5">
        {candidates.map((question, index) => (
          <fieldset key={question.id}>
            <legend className="text-[0.9375rem] font-medium leading-[1.65] text-ink">{index + 1}. {question.text}</legend>
            <div className="mt-2 flex gap-1.5" aria-label={`${index + 1}번 응답`}>
              {([1, 2, 3, 4, 5] as Likert[]).map((value) => (
                <button key={value} type="button" aria-pressed={answers[question.id] === value} onClick={() => setAnswers((current) => ({ ...current, [question.id]: value }))} className={`press min-h-10 flex-1 rounded-control text-[0.875rem] font-bold ${answers[question.id] === value ? 'bg-primary text-white' : 'bg-white text-ink-soft'}`}>{value}</button>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      {winner ? (
        <p className="mt-5 rounded-control bg-white p-4 text-[0.9375rem] font-bold leading-[1.7] text-ink">추가 질문에서는 {winner}유형 · {typeById.get(winner)!.nameKo}의 특징이 더 강하게 나타났어요. 처음 결과를 틀렸다고 보기보다 두 동기가 함께 작동할 가능성을 살펴보세요.</p>
      ) : null}
    </div>
  );
}
