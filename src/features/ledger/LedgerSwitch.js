import Segmented from '../../components/Segmented';
import { LEDGER_OPTIONS } from './ledgers';

// Daily | House
export default function LedgerSwitch({ value, onChange }) {
  return <Segmented options={LEDGER_OPTIONS} value={value} onChange={onChange} />;
}
