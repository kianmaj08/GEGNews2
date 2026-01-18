"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { votePoll } from '@/lib/api'
import { getPollPercentage, getTotalVotes } from '@/lib/helpers'
import type { Poll } from '@/lib/types'

interface PollWidgetProps {
  poll: Poll
}

export function PollWidget({ poll: initialPoll }: PollWidgetProps) {
  const [poll, setPoll] = useState(initialPoll)
  const [hasVoted, setHasVoted] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  
  const totalVotes = getTotalVotes(poll.votes)
  
  const handleVote = async (option: string) => {
    if (hasVoted || isVoting) return
    
    setIsVoting(true)
    const success = await votePoll(poll.id, option)
    
    if (success) {
      const newVotes = { ...poll.votes }
      newVotes[option] = (newVotes[option] || 0) + 1
      setPoll({ ...poll, votes: newVotes })
      setHasVoted(true)
    }
    setIsVoting(false)
  }
  
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="font-serif font-bold text-lg mb-4">{poll.question}</h3>
      
      <div className="space-y-3">
        {poll.options.map((option) => {
          const percentage = getPollPercentage(poll.votes, option)
          const voteCount = poll.votes[option] || 0
          
          return (
            <div key={option}>
              {hasVoted ? (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{option}</span>
                    <span className="font-medium">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">{voteCount} Stimmen</p>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                  onClick={() => handleVote(option)}
                  disabled={isVoting}
                >
                  {option}
                </Button>
              )}
            </div>
          )
        })}
      </div>
      
      <p className="text-xs text-muted-foreground mt-4">
        {totalVotes} Stimmen insgesamt
      </p>
    </div>
  )
}
