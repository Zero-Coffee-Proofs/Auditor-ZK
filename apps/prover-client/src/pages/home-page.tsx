import React from 'react'
import { TokenizerView } from '@/components/tokenizer-view'
import { BuyerView } from '@/components/buyer-view'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Coins } from 'lucide-react'

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Coins className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-mono text-xl font-semibold text-foreground">TokenPlatform</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Asset Tokenization Platform
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Tokenize real-world assets, purchase tokens, or verify reserves securely
          </p>
        </div>

        <Tabs defaultValue="tokenizer" className="mx-auto max-w-4xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tokenizer" className="text-base">
              Tokenize Asset
            </TabsTrigger>
            <TabsTrigger value="buyer" className="text-base">
              Buy Tokens
            </TabsTrigger>
            <TabsTrigger value="verifier" className="text-base">
              Verify Reserves
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tokenizer" className="mt-6">
            <TokenizerView />
          </TabsContent>

          <TabsContent value="buyer" className="mt-6">
            <BuyerView />
          </TabsContent>

          <TabsContent value="verifier" className="mt-6">
            <div className="space-y-4 rounded-lg border border-dashed border-border p-6 text-left">
              <h2 className="text-xl font-semibold text-foreground">Launch the verifier workspace</h2>
              <p className="text-muted-foreground">
                Generating TLSNotary proofs requires a cross-origin isolated page so Web Workers can
                access SharedArrayBuffer. Launch the secure workspace to continue.
              </p>
              <Button onClick={() => window.location.assign('/verify')}>
                Open verifier workspace
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mt-16 border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by blockchain technology. Secure, transparent, and efficient.</p>
        </div>
      </footer>
    </div>
  )
}
