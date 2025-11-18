import { TokenizerView } from '@/components/tokenizer-view';
import { BuyerView } from '@/components/buyer-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-primary">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Coins className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-mono text-xl font-semibold text-primary-foreground">
              TokenPlatform
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-balance text-4xl font-bold tracking-tight text-accent md:text-5xl">
            Asset Tokenization Platform
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Tokenize real-world assets or purchase existing tokens securely
          </p>
        </div>

        <Tabs defaultValue="tokenizer" className="mx-auto max-w-4xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tokenizer" className="text-base">
              Tokenize Asset
            </TabsTrigger>
            <TabsTrigger value="buyer" className="text-base">
              Buy Tokens
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tokenizer" className="mt-6">
            <TokenizerView />
          </TabsContent>

          <TabsContent value="buyer" className="mt-6">
            <BuyerView />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mt-auto border-t border-border bg-secondary py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by blockchain technology. Secure, transparent, and efficient.</p>
        </div>
      </footer>
    </div>
  );
}
