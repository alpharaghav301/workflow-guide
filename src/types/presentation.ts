export interface Slide {
  id: number;
  title: string;
  content: string[];
  type: "title" | "content" | "agenda" | "qa";
}

export interface Presentation {
  title: string;
  subtitle: string;
  slides: Slide[];
}
