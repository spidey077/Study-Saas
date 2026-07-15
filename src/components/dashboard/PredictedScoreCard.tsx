'use client'

import { formatDistanceToNow, parseISO } from 'date-fns'
import { motion } from 'framer-motion'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
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
  const isCritical = subject.prediction_status === 'critical'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
    >
      <Card className="border border-slate-200/80 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base">Predicted Score — {subject.name}</CardTitle>
        </CardHeader>

        {hasPrediction ? (
          <div className="space-y-3">
            <div className="flex items-end justify-between gap-4">
              <p className="text-4xl font-bold text-slate-900 dark:text-white">
                <AnimatedCounter value={subject.predicted_score || 0} duration={800} suffix="%" />
              </p>
              {subject.prediction_status && (
                <motion.div
                  animate={isCritical ? { opacity: [1, 0.7, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Badge variant={statusBadgeVariant(subject.prediction_status)} className="capitalize">
                    {formatStatus(subject.prediction_status)}
                  </Badge>
                </motion.div>
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
          <motion.div
            className="flex flex-col items-center justify-center py-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Complete your first quiz to see your predicted score
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}
