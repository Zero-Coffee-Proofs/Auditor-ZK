import { Button } from '@/components/ui/button';
import { ConnectWalletButton } from './components/ConnectWalletButton';
import { Plaid } from './components/Plaid';
function App() {
  return (
    <>
      <Button>Hola</Button>
      <ConnectWalletButton />
      <h1 className="text-3xl font-bold underline text-red-500">Hello world!</h1>
      <Plaid />
    </>
  );
}

export default App;
