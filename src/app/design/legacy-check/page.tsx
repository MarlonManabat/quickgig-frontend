import Button from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function LegacyCheckPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold">Legacy Theme Check</h1>
      <div className="flex gap-4 flex-wrap">
        <Button>Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="outline">Outline Button</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Input" placeholder="Type here" />
        <Select label="Select" options={[{ value: '1', label: 'One' }]} placeholder="Choose" />
        <Textarea label="Textarea" placeholder="Say something" />
      </div>
      <Card>
        <CardHeader>Card Header</CardHeader>
        <CardContent>
          <p>Card content goes here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
