CREATE TABLE "anotacoes_mesa" (
	"id" text PRIMARY KEY NOT NULL,
	"mesa_id" text NOT NULL,
	"conteudo" text DEFAULT '' NOT NULL,
	"atualizada_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "anotacoes_mesa_mesa_id_unique" UNIQUE("mesa_id")
);
--> statement-breakpoint
CREATE TABLE "mesas" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"nome" text NOT NULL,
	"codigo_convite" text NOT NULL,
	"criada_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizada_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mesas_codigo_convite_unique" UNIQUE("codigo_convite")
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" text PRIMARY KEY NOT NULL,
	"mesa_id" text NOT NULL,
	"user_id" text,
	"nome" text NOT NULL,
	"jogador" text,
	"apt_base" integer DEFAULT 1 NOT NULL,
	"pv_max" integer DEFAULT 6 NOT NULL,
	"pa_max" integer DEFAULT 6 NOT NULL,
	"pd" integer DEFAULT 3 NOT NULL,
	"velocidade" integer DEFAULT 6 NOT NULL,
	"carteira" jsonb DEFAULT '{"fundos":6,"espirions":0}'::jsonb NOT NULL,
	"ficha" jsonb NOT NULL,
	"criada_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizada_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rolagens_mesa" (
	"id" text PRIMARY KEY NOT NULL,
	"mesa_id" text NOT NULL,
	"autor" text NOT NULL,
	"dados" jsonb NOT NULL,
	"criada_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"google_id" text NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"avatar_url" text,
	"role" text DEFAULT 'user' NOT NULL,
	"criada_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "anotacoes_mesa" ADD CONSTRAINT "anotacoes_mesa_mesa_id_mesas_id_fk" FOREIGN KEY ("mesa_id") REFERENCES "public"."mesas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mesas" ADD CONSTRAINT "mesas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_mesa_id_mesas_id_fk" FOREIGN KEY ("mesa_id") REFERENCES "public"."mesas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rolagens_mesa" ADD CONSTRAINT "rolagens_mesa_mesa_id_mesas_id_fk" FOREIGN KEY ("mesa_id") REFERENCES "public"."mesas"("id") ON DELETE cascade ON UPDATE no action;