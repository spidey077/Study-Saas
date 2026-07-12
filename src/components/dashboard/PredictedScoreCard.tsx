'use client'

import { formatDistanceToNow, parseISO } from 'date-fns'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { Subject, PredictionStatus } from '@/types'

interface PredictedScoreCardProps {
  subject: Subject
}

function statusBadgeVariant(status: PredictionStatus): 'success' | 'warning' | 'danger' {
  switch (status) {
    case 'on_track':
      return 'success'
    case 'behind':
      return 'warning'
    case 'critical':
      return 'danger'
  }
}

function formatStatus(status: PredictionStatus): string {
  return status.replace('_', ' ')
}

export default function PredictedScoreCard({ subject }: PredictedScoreCardProps) {
  const hasPrediction = subject.predicted_score != null

  return (
    <Card className="border-2 border-slate-200/60 dark:border-slate-700/60">
      <CardHeader>
        <CardTitle className="text-base">Predicted Score — {subject.name}</CardTitle>
      </CardHeader>

      {hasPrediction ? (
        <div className="space-y-3">
          <div className="flex items-end justify-between gap-4">
            <p className="text-4xl font-bold text-slate-900 dark:text-white">
              {subject.predicted_score}%
            </p>
            {subject.prediction_status && (
              <Badge variant={statusBadgeVariant(subject.prediction_status)} className="capitalize">
                {formatStatus(subject.prediction_status)}
              </Badge>
            )}
          </div>

          {subject.prediction_action && (
            <p className="text-sm text-slate-700 dark:text-slate-300">{subject.prediction_action}</p>
          )}

          {subject.prediction_updated_at && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Last updated {formatDistanceToNow(parseISO(subject.prediction_updated_at), { addSuffix: true })}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Complete your first quiz to see your predicted score
        </p>
      )}
    </Card>
  )
}
