'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, Loader2, TrendingUp } from 'lucide-react'

interface TokenInfo {
  symbol: string
  name: string
  totalSupply: number
  available: number
  pricePerToken: number
}

export function BuyerView() {
  const [contractAddress, setContractAddress] = useState('')
  const [tokenAmount, setTokenAmount] = useState('')
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setTokenInfo(null)
    setIsLoading(true)

    // Simulate API call to fetch contract info
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock data - in production, this would fetch from blockchain
    if (contractAddress.length > 10) {
      setTokenInfo({
        symbol: 'OFFICE',
        name: 'Downtown Office Building',
        totalSupply: 1000000,
        available: 450000,
        pricePerToken: 10.5,
      })
    } else {
      setError('Invalid contract address. Please check and try again.')
    }

    setIsLoading(false)
  }

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPurchasing(true)

    // Simulate purchase transaction
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsPurchasing(false)
    setShowSuccess(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
      setTokenAmount('')
    }, 3000)
  }

  const totalCost = tokenInfo && tokenAmount
    ? (parseFloat(tokenAmount) * tokenInfo.pricePerToken).toFixed(2)
    : '0.00'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Purchase Tokens</CardTitle>
        <CardDescription>
          Enter a contract address to view available tokens and make a purchase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {showSuccess && (
          <Alert className="border-accent bg-accent/10">
            <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
            <AlertDescription className="text-accent-foreground">
              Purchase successful! Tokens will be transferred to your wallet shortly.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLookup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contract-address">Token Contract Address</Label>
            <div className="flex gap-2">
              <Input
                id="contract-address"
                placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="font-mono text-sm"
                required
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Lookup'
                )}
              </Button>
            </div>
          </div>
        </form>

        {tokenInfo && (
          <div className="space-y-6">
            <Card className="border-border bg-muted/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {tokenInfo.name}
                        </h3>
                        <Badge variant="outline" className="font-mono">
                          {tokenInfo.symbol}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Real-world asset backed token
                      </p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Price per Token</p>
                      <p className="text-lg font-semibold text-foreground">
                        ${tokenInfo.pricePerToken}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available</p>
                      <p className="text-lg font-semibold text-foreground">
                        {tokenInfo.available.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Supply</p>
                      <p className="text-lg font-semibold text-foreground">
                        {tokenInfo.totalSupply.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handlePurchase} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token-amount">Number of Tokens</Label>
                <Input
                  id="token-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  max={tokenInfo.available}
                  min="1"
                  required
                />
                {tokenAmount && parseFloat(tokenAmount) > tokenInfo.available && (
                  <p className="text-sm text-destructive">
                    Only {tokenInfo.available.toLocaleString()} tokens available
                  </p>
                )}
              </div>

              {tokenAmount && parseFloat(tokenAmount) > 0 && (
                <Card className="border-accent bg-accent/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-foreground">Total Cost:</span>
                      <span className="text-2xl font-bold text-foreground">${totalCost}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={
                  isPurchasing ||
                  !tokenAmount ||
                  parseFloat(tokenAmount) <= 0 ||
                  parseFloat(tokenAmount) > tokenInfo.available
                }
              >
                {isPurchasing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Purchase...
                  </>
                ) : (
                  'Purchase Tokens'
                )}
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
