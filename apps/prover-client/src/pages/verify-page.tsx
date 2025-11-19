import React, { useEffect, useState } from 'react'
import { VerifierView } from '@/components/verifier-view'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Loader2, Shield } from 'lucide-react'
import {
  loadTokenizerSession,
  clearTokenizerSession,
  type TokenizerSessionData,
} from '@/lib/tokenizer-session'

interface SessionState {
  status: 'loading' | 'ready' | 'missing'
  data: TokenizerSessionData | null
}

export function VerifyPage() {
  const [session, setSession] = useState<SessionState>({ status: 'loading', data: null })

  useEffect(() => {
    const data = loadTokenizerSession()
    if (data) {
      setSession({ status: 'ready', data })
    } else {
      setSession({ status: 'missing', data: null })
    }
  }, [])

  const handleReturnHome = () => {
    clearTokenizerSession()
    window.location.assign('/')
  }

  if (session.status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Preparing verifier workspace...
        </div>
      </div>
    )
  }

  if (session.status === 'missing' || !session.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>No active tokenization session</CardTitle>
            <CardDescription>
              We could not find details from a recent Plaid connection. Start again from the tokenizer flow.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button onClick={handleReturnHome}>Return to dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { data } = session
  const formatCurrency = (value: string) => {
    const numeric = Number(value)
    if (Number.isFinite(numeric)) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numeric)
    }
    return value
  }

  const formatNumber = (value: string) => {
    const numeric = Number(value)
    if (Number.isFinite(numeric)) {
      return new Intl.NumberFormat('en-US').format(numeric)
    }
    return value
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Proof of Funds Workspace</p>
              <p className="text-sm text-muted-foreground">
                Cross-origin isolated environment for secure TLSNotary proving
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleReturnHome}>
            Exit workspace
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Alert>
            <AlertDescription>
              Successfully received a Plaid access token for <strong>{data.assetName || 'your asset'}</strong>
              {data.accountName ? (
                <>
                  {' '}and account <strong>{data.accountName}</strong>
                </>
              ) : null}
              . You can now generate the TLSNotary proof in an isolated context.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Session details</CardTitle>
              <CardDescription>
                These values were captured before redirecting into the isolated verifier workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 md:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Asset</dt>
                  <dd className="text-base text-foreground">{data.assetName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Asset value (USD)</dt>
                  <dd className="text-base text-foreground">{formatCurrency(data.assetValue)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Token supply</dt>
                  <dd className="text-base text-foreground">{formatNumber(data.tokenSupply)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Selected proof target</dt>
                  <dd className="text-base text-foreground uppercase">{data.target}</dd>
                </div>
                {data.accountId ? (
                  <div>
                    <dt className="text-sm text-muted-foreground">Plaid account id</dt>
                    <dd className="text-base text-foreground break-all">{data.accountId}</dd>
                  </div>
                ) : null}
                <div className="md:col-span-2">
                  <dt className="text-sm text-muted-foreground">Asset description</dt>
                  <dd className="text-base text-foreground">{data.description}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <VerifierView accessToken={data.accessToken} accountId={data.accountId} />
        </div>
      </main>
    </div>
  )
}
