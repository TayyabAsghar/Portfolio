import menu from "../data/menu.json";
import music from "../data/music.json";
import about from "../data/about.json";
import stacks from "../data/stacks.json";
import clients from "../data/clients.json";
import education from "../data/education.json";
import experiences from "../data/experiences.json";
import certificates from "../data/certificates.json";
import testimonials from "../data/testimonials.json";

export type AboutType = typeof about;
export type StackType = typeof stacks;
export type MenuType = typeof menu[0];
export type MusicType = typeof music[0];
export type ClientType = typeof clients[0];
export type EducationType = typeof education[0];
export type ExperienceType = typeof experiences[0];
export type CertificateType = typeof certificates[0]; 
export type TestimonialType = typeof testimonials[0];