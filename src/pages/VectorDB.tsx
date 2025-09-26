import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// NOTE: This is a mock UI replicating the layout shown in the screenshot
// Focused on structure/UX only; actions are placeholders so you can wire them to your backend later.

const VectorDB: React.FC = () => {
  const [dbName, setDbName] = useState('traffic law');
  const [url, setUrl] = useState('https://bitsness.vn/ve-bitsness-ai-automation-agency/');
  const [question, setQuestion] = useState('');

  return (
    <div className="min-h-screen bg-[#0b0f16] text-gray-100">
      {/* Top menu bar */}
      <div className="w-full border-b border-white/10 bg-[#0c111b] px-4 py-2 text-sm">
        <div className="mx-auto flex max-w-[1400px] items-center gap-6">
          <Tabs value="file" className="hidden sm:block">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger value="file" className="data-[state=active]:text-white">File</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:text-white">Cài đặt</TabsTrigger>
              <TabsTrigger value="help" className="data-[state=active]:text-white">Hỗ trợ</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content area */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 p-4 md:grid-cols-12">
        {/* Controls row */}
        <div className="md:col-span-12">
          <Card className="bg-[#0f1420] border-white/10">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">Vector DB:</span>
                  <Input
                    value={dbName}
                    onChange={(e) => setDbName(e.target.value)}
                    className="w-[220px] bg-black/40 text-gray-100"
                  />
                  <Button variant="secondary" className="bg-white/10 hover:bg-white/20">DB mới</Button>
                  <Button variant="destructive" className="bg-red-600/80 hover:bg-red-600">Xoá DB</Button>
                </div>
                <div className="flex grow items-center gap-2">
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-black/40 text-gray-100"
                  />
                  <Button className="bg-blue-600/80 hover:bg-blue-600">Thêm vào DB</Button>
                  <Button className="bg-white/10 hover:bg-white/20">Xoá tài liệu đã chọn</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Left sidebar */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <Card className="bg-[#0f1420] border-white/10 h-[520px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-200">Tài liệu trong DB (doc_id)</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-[360px] rounded-md border border-white/5">
                <div className="p-2 space-y-2 text-sm">
                  <div className="rounded-md bg-black/30 p-2">35_2024_QH15_588811.docx</div>
                  <div className="rounded-md bg-black/30 p-2">luật giao thông đường bộ.doc</div>
                </div>
              </ScrollArea>
              <div className="pt-3">
                <Button className="w-full bg-blue-600/80 hover:bg-blue-600">Hội thoại mới</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f1420] border-white/10 h-[260px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-200">Lịch sử hội thoại</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-[180px] rounded-md border border-white/5">
                <div className="p-2 text-sm space-y-2">
                  <div className="rounded-md bg-black/30 p-2">bao nhiêu tuổi được đi xe máy</div>
                  <div className="rounded-md bg-black/30 p-2">vận tải</div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat panel */}
        <div className="md:col-span-9">
          <Card className="bg-[#0f1420] border-white/10 h-[780px] flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-200">Hỏi - Đáp</CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 grow flex-col gap-3 pt-0">
              <ScrollArea className="min-h-[560px] grow rounded-md border border-white/5 bg-black/20 p-4">
                <div className="prose prose-invert max-w-none text-gray-100 text-sm leading-relaxed">
                  <p>
                    Khi thuê vận chuyển hàng hóa bằng ô tô, bạn cần chú ý đến một số vi phạm có thể xảy ra để đảm bảo quá trình vận chuyển diễn ra thuận lợi và hợp pháp...
                  </p>
                  {/* Content shortened for brevity */}
                </div>
              </ScrollArea>

              <Separator className="bg-white/10" />
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder="Nhập câu hỏi..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[44px] grow bg-black/40 text-gray-100"
                />
                <Button className="bg-blue-600/80 hover:bg-blue-600 px-6">Gửi</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VectorDB;