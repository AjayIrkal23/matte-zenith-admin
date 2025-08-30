import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, List } from "lucide-react";
import AnnotateTab from "@/components/annotation/AnnotateTab";
import AnnotatedListTab from "@/components/annotation/AnnotatedListTab";

export default function AnnotationPage() {
  const [activeTab, setActiveTab] = useState("annotate");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Image Annotation</h1>
          <p className="text-text-muted mt-1">
            Annotate safety violations in images
          </p>
        </div>
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <PenTool className="w-6 h-6 text-adani-primary" />
            Annotation Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="annotate" 
                className="flex items-center gap-2"
              >
                <PenTool className="w-4 h-4" />
                Annotate
              </TabsTrigger>
              <TabsTrigger 
                value="annotated-list" 
                className="flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                Annotated List
              </TabsTrigger>
            </TabsList>

            <TabsContent value="annotate" className="mt-0">
              <AnnotateTab />
            </TabsContent>

            <TabsContent value="annotated-list" className="mt-0">
              <AnnotatedListTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}