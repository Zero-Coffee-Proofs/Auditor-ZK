import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { usePlaidLink } from 'react-plaid-link'

const PAYMENT_OPTIONS = [
  { id: 'usd', name: 'USD (via Plaid)', icon: '$', enabled: true },
  { id: 'btc', name: 'Bitcoin', icon: '₿', enabled: false },
  { id: 'eth', name: 'Ethereum', icon: 'Ξ', enabled: false },
  { id: 'usdc', name: 'USDC', icon: '$', enabled: false },
  { id: 'usdt', name: 'USDT', icon: '$', enabled: false },
]

const BACKEND_URL = 'http://localhost:8080';

export function TokenizerView() {
  const [assetName, setAssetName] = useState('')
  const [assetValue, setAssetValue] = useState('')
  const [tokenSupply, setTokenSupply] = useState('')
  const [description, setDescription] = useState('')
  const [target, setTarget] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);



  // get link token from backend
  const createLinkToken = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/create_link_token`, {
        method: 'POST'
      });
      const data = await response.json();
      setLinkToken(data.link_token);
    } catch (error) {
      console.error('Error creating link token:', error);
    }
  };

  // exchange public token for access token
  const onSuccess = async (public_token: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/exchange_public_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token })
      });
      const data = await response.json();
      setAccessToken(data.access_token);
      console.log('Access token received:', data.access_token);
    } catch (error) {
      console.error('Error exchanging token:', error);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess
  });




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setShowSuccess(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
      setAssetName('')
      setAssetValue('')
      setTokenSupply('')
      setDescription('')
      setTarget('')
    }, 3000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Tokenize Your Asset</CardTitle>
        <CardDescription>
          Fill in the details below to create digital tokens representing your real-world asset
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showSuccess && (
          <Alert className="mb-6 border-accent bg-accent/10">
            <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
            <AlertDescription className="text-accent-foreground">
              Asset tokenization initiated successfully! Processing your request.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="asset-name">Asset Name</Label>
              <Input
                id="asset-name"
                placeholder="e.g., Downtown Office Building"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset-value">Asset Value (USD)</Label>
              <Input
                id="asset-value"
                type="number"
                placeholder="1000000"
                value={assetValue}
                onChange={(e) => setAssetValue(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token-supply">Total Token Supply</Label>
              <Input
                id="token-supply"
                type="number"
                placeholder="1000000"
                value={tokenSupply}
                onChange={(e) => setTokenSupply(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Asset Description</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about your asset..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">What do you want to tokenize?</Label>
            <Select value={target} onValueChange={setTarget} required>
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Select proof of funds" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.id}
                    value={option.id}
                    disabled={!option.enabled}
                    className={!option.enabled ? 'opacity-50' : ''}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{option.icon}</span>
                      <span>{option.name}</span>
                      {!option.enabled && (
                        <span className="text-xs text-muted-foreground">(Coming Soon)</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {target === 'usd' && (
              <Alert className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  You will be redirected to Plaid to connect your bank account securely
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {!linkToken && <Button onClick={createLinkToken}>Get Link Token</Button>}

            {linkToken && !accessToken && (
              <Button onClick={() => open()} disabled={!ready}>
                Connect Bank Account
              </Button>
            )}



          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
