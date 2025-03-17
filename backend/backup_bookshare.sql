--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: neon_auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA neon_auth;


--
-- Name: log_last_motdepasse(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_last_motdepasse() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.mot_de_passe <> OLD.mot_de_passe THEN
        INSERT INTO mot_de_passe_histo (id, mot_de_passe, date_histo)
        VALUES (OLD.id, OLD.mot_de_passe, CURRENT_DATE);
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: save_old_password(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.save_old_password() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO histo_mot_de_passe (utilisateur_id, ancien_mot_de_passe, date_modification)
    VALUES (OLD.id, OLD.mot_de_passe, NOW());
    RETURN NEW;
END;
$$;


--
-- Name: save_password_history(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.save_password_history() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO histo_mot_de_passe (utilisateur_id, ancien_mot_de_passe, date_modification)
    VALUES (OLD.id, NEW.mot_de_passe, NOW());
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users_sync; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.users_sync (
    raw_json jsonb NOT NULL,
    id text GENERATED ALWAYS AS ((raw_json ->> 'id'::text)) STORED NOT NULL,
    name text GENERATED ALWAYS AS ((raw_json ->> 'display_name'::text)) STORED,
    email text GENERATED ALWAYS AS ((raw_json ->> 'primary_email'::text)) STORED,
    created_at timestamp with time zone GENERATED ALWAYS AS (to_timestamp((trunc((((raw_json ->> 'signed_up_at_millis'::text))::bigint)::double precision) / (1000)::double precision))) STORED,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: echanges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.echanges (
    id integer NOT NULL,
    utilisateur_preteur_id character varying(255) NOT NULL,
    utilisateur_emprunteur_id character varying(255) NOT NULL,
    livre_preteur_id integer NOT NULL,
    livre_emprunteur_id integer NOT NULL,
    statut character varying(50) NOT NULL,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_finalisation timestamp without time zone
);


--
-- Name: echanges_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.echanges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: echanges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.echanges_id_seq OWNED BY public.echanges.id;


--
-- Name: emprunts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.emprunts (
    id integer NOT NULL,
    livre_id integer NOT NULL,
    emprunteur_id character varying(255) NOT NULL,
    statut character varying(50) NOT NULL,
    date_debut date NOT NULL,
    date_fin date
);


--
-- Name: emprunts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.emprunts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: emprunts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.emprunts_id_seq OWNED BY public.emprunts.id;


--
-- Name: histo_mot_de_passe; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.histo_mot_de_passe (
    utilisateur_id character varying(255) NOT NULL,
    ancien_mot_de_passe character varying(100) NOT NULL,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: livres; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.livres (
    id integer NOT NULL,
    titre character varying(255) NOT NULL,
    auteur character varying(255) NOT NULL,
    genre character varying(100),
    date_publication date,
    disponibilite boolean DEFAULT true,
    utilisateur_id character varying(255)
);


--
-- Name: livres_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.livres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: livres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.livres_id_seq OWNED BY public.livres.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    message character varying(255) NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.utilisateurs (
    id character varying(255) NOT NULL,
    nom character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    mot_de_passe character varying(100) NOT NULL,
    date_inscription timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_naissance date NOT NULL,
    lieu_naissance character varying(150) NOT NULL,
    role character varying(20) DEFAULT 'client'::character varying NOT NULL
);


--
-- Name: echanges id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.echanges ALTER COLUMN id SET DEFAULT nextval('public.echanges_id_seq'::regclass);


--
-- Name: emprunts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emprunts ALTER COLUMN id SET DEFAULT nextval('public.emprunts_id_seq'::regclass);


--
-- Name: livres id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.livres ALTER COLUMN id SET DEFAULT nextval('public.livres_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Data for Name: users_sync; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.users_sync (raw_json, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: echanges; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.echanges (id, utilisateur_preteur_id, utilisateur_emprunteur_id, livre_preteur_id, livre_emprunteur_id, statut, date_creation, date_finalisation) FROM stdin;
\.


--
-- Data for Name: emprunts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.emprunts (id, livre_id, emprunteur_id, statut, date_debut, date_fin) FROM stdin;
\.


--
-- Data for Name: histo_mot_de_passe; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.histo_mot_de_passe (utilisateur_id, ancien_mot_de_passe, date_modification) FROM stdin;
U12345	MotDePasse123	2025-02-27 01:16:39.271645
U12345	NouveauMotDePasse456	2025-02-27 01:17:47.267454
U12345	Nou88888	2025-02-27 01:27:49.007924
U12345	$2b$10$IGIN4bEqIvB2Shr/eWcf0ueQ7UcF3l3v/G1K.V1QAN7ZzhCGf68yC	2025-02-27 01:28:26.884397
U12345	$2b$10$8v2GbQUm6fFurCAAdETRMOvffm/Ofo10hkgh.F5TIDTkdpXFVV6/K	2025-02-27 01:30:34.654577
U12345	$2b$10$OkAiMpsTamqSkXqiMRmbLuzGElVyfVIyor8F8jysmajK5rQPVixa2	2025-02-27 01:30:40.367069
U12345	$2b$10$xBH9vqkHX.cjvz9F2b9RjeF5QrVJqMfDqt8NTfS.kKFAJKLQfXPfe	2025-02-27 01:49:37.471378
U12345	$2b$10$Y5gWqTLJfhsodWnCF/ELIO1MSpHY6sj.eGfBPs1U3wsSV4sLXy52C	2025-02-27 01:49:40.829692
U12345	$2b$10$e9gJFSPPOianSjP/yf5mu.fSIXTC7g.ZhoJ2CuEhhqhmMp1iEC8vq	2025-02-27 01:51:23.911367
U12345	$2b$10$ESWhM3ywYnSYYEG.sd3rXeJLkf7EcAM.F6q1QsOdCWjr01p2yECAm	2025-02-27 01:51:26.83673
U12345	$2b$10$PPLamSOKom0cFHbwtPr3W.UWx3q4i8AtnfVxb2Ak/ITWHixyAwn26	2025-02-27 01:55:03.513521
c6720034-f372-4191-b59e-7122a7c33dd6	$2b$10$Mg8mCRCH200b3mejDcuIlO8c4V7Npm0DxnDLIUpNrwtIrhCnV/olG	2025-02-27 16:56:15.614419
c6720034-f372-4191-b59e-7122a7c33dd6	$2b$10$GhX.Je7Imk046FYydM4HNemiO227Ri6ARrxCwP3KwECTz./0PEHRC	2025-02-27 16:56:46.173524
c6720034-f372-4191-b59e-7122a7c33dd6	$2b$10$bmoU3/DuuQ9LA5oexdg9sO1wz8EzjWVjvFd6PFmISNm9qZee1yqJy	2025-02-27 16:57:34.006619
c6720034-f372-4191-b59e-7122a7c33dd6	$2b$10$nv1.k87h48rp.HXF54Vz9.4/bXuHLRK6B3VRoGaxoIi7jNpLaYa2C	2025-02-27 17:00:05.757698
c6720034-f372-4191-b59e-7122a7c33dd6	$2b$10$mb4UVvO893cLCbniYJvQfONwPN5IaZyhirsv3ntwUhUAQr6sll9te	2025-02-27 17:00:22.395575
c6720034-f372-4191-b59e-7122a7c33dd6	$2b$10$wsUT5lmAqVgCtqtgIiOi6eQeQQT3WvFPqTGEcZ6SzA1WdFUXGEbIq	2025-02-27 17:33:33.345124
c6720034-f372-4191-b59e-7122a7c33dd6	$2b$10$cmkdBNqLl8/cZwDeej4pjugajR5Hg8c5hsqvte79Qauutu/divrPC	2025-02-27 17:35:12.362638
c6720034-f372-4191-b59e-7122a7c33dd6	$2b$10$KhWmp8yW17KRppEhIxrqqe//4TKW94joEDm/gz.iYA18N9asFGhaO	2025-02-27 17:42:45.659085
c6720034-f372-4191-b59e-7122a7c33dd6	$2b$10$Bs.UGw6mVVA29B7babI5Zuud3zgLHOYE/1FXaA4ntZKIMjYm.Ds4O	2025-02-27 17:43:16.478643
c6720034-f372-4191-b59e-7122a7c33dd6	$2b$10$iMY5ohU1BjNvU3Murz/AzuXCWMiDAtX3VxWVSlrmYq02q3199FbOy	2025-02-27 18:03:10.401514
c6720034-f372-4191-b59e-7122a7c33dd6	$2b$10$R9ATO6DXTgLFRoDa.l0IDO5waK9zqdmeK13GPOA8sbiPMMFL/a3t6	2025-02-27 18:04:35.243318
c6720034-f372-4191-b59e-7122a7c33dd6	$2b$10$.XsNUtMyQJy.M6vd.IbY/eM0KxV3IyBOgtCf935632NvstSAzvo9O	2025-02-28 01:01:02.877372
c6720034-f372-4191-b59e-7122a7c33dd6	$2b$10$/mEfuKxRvdp.V/u6L0iJ6.NZEYbZqDa1ubfzVXkNOiLuiH/tDDOHi	2025-02-28 01:01:47.793364
aef6a70f-f802-4320-8f86-66eaf95e35c7	$2b$10$7sJHhMZ0OaFZH7uNv3h4UeEgYVqMReRjHnOQhi3HdKixG71M5j0xW	2025-03-02 03:49:44.438333
a0170d12-a0c0-41d5-862b-45828e414d57	$2b$10$caIDNrispdnK7pKMSfdnEu2B/dMdajXpiR4VvHS1VE.HpTwoJeoF.	2025-03-02 04:04:54.929312
712e50ae-2acc-4e39-86b5-d97971944e37	$2b$10$DqAUROqUMp1NmHGj6OiyFuV1KJIOco7nSd5vRU0hSsHQ6/02.7mGC	2025-03-02 04:13:39.807441
07334f46-7c5f-4f74-b18f-62dfe3485714	{}	2025-03-02 14:42:58.126754
645badcf-bfa9-4365-98b4-c6d71a88acd0	{}	2025-03-02 15:10:52.521682
287a1924-bf98-4f70-b17b-3ac5452db308	{}	2025-03-02 15:18:11.247964
347df8ce-6bbe-46c8-bf65-aa88e93531d8	{}	2025-03-02 15:25:08.972101
98e0edd3-2e69-4ed4-932e-06324223ece4	$2b$10$XOkui6DCnTP1YouerwoRouOSvQ2xnjpVepjN6ycKiCKnbaSsbJ48K	2025-03-02 15:28:09.816864
\.


--
-- Data for Name: livres; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.livres (id, titre, auteur, genre, date_publication, disponibilite, utilisateur_id) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id, user_id, message, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.utilisateurs (id, nom, email, mot_de_passe, date_inscription, date_naissance, lieu_naissance, role) FROM stdin;
287a1924-bf98-4f70-b17b-3ac5452db308	T Karim	t.karim@example.com	{}	2025-03-02 15:17:10.734181	1998-07-14	Casablanca, Maroc	client
347df8ce-6bbe-46c8-bf65-aa88e93531d8	P Karim	p.karim@example.com	{}	2025-03-02 15:24:34.466512	1998-07-14	Casablanca, Maroc	client
98e0edd3-2e69-4ed4-932e-06324223ece4	D Karim	d.karim@example.com	$2b$10$XOkui6DCnTP1YouerwoRouOSvQ2xnjpVepjN6ycKiCKnbaSsbJ48K	2025-03-02 15:27:42.622773	1998-07-14	Casablanca, Maroc	client
3fdf983f-b645-4d53-b5e6-d6575694bcaf	J lamyae	j@example.com	$2b$10$T4Ij5tSKvRY18V8eq8hUseLG.RiC9ykVmDoo2NWLpkQqsZodAZT1K	2025-03-05 14:14:35.296183	1998-07-14	Casablanca, Maroc	client
2	Test User	test@example.com	password123	2025-03-15 20:12:37.964692	1998-07-14	Casablanca	client
U12345	John Doe	eloukili.nada@etu.uae.ac.ma	$2b$10$PPLamSOKom0cFHbwtPr3W.UWx3q4i8AtnfVxb2Ak/ITWHixyAwn26	2025-02-27 01:10:29.711099	1995-06-15	Paris	admin
d35e344e-094b-4356-8b49-adf016ad72c6	Salman	hello@gmail.com	$2b$10$Kk8rUIO43JfXC7XhVa102u3NGvbdR6SBcZNOtCZKSc.42uFtnDnSO	2025-02-27 18:02:11.772979	2004-05-04	Tangier	client
c6720034-f372-4191-b59e-7122a7c33dd6	Jean Dupont	nn0955616@gmail.com	$2b$10$/mEfuKxRvdp.V/u6L0iJ6.NZEYbZqDa1ubfzVXkNOiLuiH/tDDOHi	2025-02-27 16:22:11.857399	1995-08-25	Paris	client
aef6a70f-f802-4320-8f86-66eaf95e35c7	human	user01@example.com	$2b$10$7sJHhMZ0OaFZH7uNv3h4UeEgYVqMReRjHnOQhi3HdKixG71M5j0xW	2025-02-28 01:05:27.844188	2004-07-29	univers	client
a0170d12-a0c0-41d5-862b-45828e414d57	Jean Dupont	jean.dupont@example.com	$2b$10$caIDNrispdnK7pKMSfdnEu2B/dMdajXpiR4VvHS1VE.HpTwoJeoF.	2025-03-02 04:03:26.459527	1990-05-15	Paris, France	client
712e50ae-2acc-4e39-86b5-d97971944e37	Alice Martin	alice.martin@example.com	$2b$10$DqAUROqUMp1NmHGj6OiyFuV1KJIOco7nSd5vRU0hSsHQ6/02.7mGC	2025-03-02 04:12:39.793479	1995-09-21	Lyon, France	client
07334f46-7c5f-4f74-b18f-62dfe3485714	Mohamed Karim	mohamed.karim@example.com	{}	2025-03-02 14:41:50.807306	1998-07-14	Casablanca, Maroc	client
645badcf-bfa9-4365-98b4-c6d71a88acd0	M Karim	m.karim@example.com	{}	2025-03-02 15:06:02.024244	1998-07-14	Casablanca, Maroc	client
\.


--
-- Name: echanges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.echanges_id_seq', 1, false);


--
-- Name: emprunts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.emprunts_id_seq', 1, false);


--
-- Name: livres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.livres_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: users_sync users_sync_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.users_sync
    ADD CONSTRAINT users_sync_pkey PRIMARY KEY (id);


--
-- Name: echanges echanges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.echanges
    ADD CONSTRAINT echanges_pkey PRIMARY KEY (id);


--
-- Name: emprunts emprunts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emprunts
    ADD CONSTRAINT emprunts_pkey PRIMARY KEY (id);


--
-- Name: livres livres_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.livres
    ADD CONSTRAINT livres_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: utilisateurs utilisateurs_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_email_key UNIQUE (email);


--
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (id);


--
-- Name: users_sync_deleted_at_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX users_sync_deleted_at_idx ON neon_auth.users_sync USING btree (deleted_at);


--
-- Name: utilisateurs before_password_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER before_password_update BEFORE UPDATE ON public.utilisateurs FOR EACH ROW WHEN (((old.mot_de_passe)::text IS DISTINCT FROM (new.mot_de_passe)::text)) EXECUTE FUNCTION public.save_password_history();


--
-- Name: emprunts fk_emprunteur; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emprunts
    ADD CONSTRAINT fk_emprunteur FOREIGN KEY (emprunteur_id) REFERENCES public.utilisateurs(id) ON DELETE CASCADE;


--
-- Name: echanges fk_emprunteur; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.echanges
    ADD CONSTRAINT fk_emprunteur FOREIGN KEY (utilisateur_emprunteur_id) REFERENCES public.utilisateurs(id) ON DELETE RESTRICT;


--
-- Name: emprunts fk_livre; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emprunts
    ADD CONSTRAINT fk_livre FOREIGN KEY (livre_id) REFERENCES public.livres(id) ON DELETE RESTRICT;


--
-- Name: echanges fk_livre_emprunteur; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.echanges
    ADD CONSTRAINT fk_livre_emprunteur FOREIGN KEY (livre_emprunteur_id) REFERENCES public.livres(id) ON DELETE RESTRICT;


--
-- Name: echanges fk_livre_preteur; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.echanges
    ADD CONSTRAINT fk_livre_preteur FOREIGN KEY (livre_preteur_id) REFERENCES public.livres(id) ON DELETE RESTRICT;


--
-- Name: echanges fk_preteur; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.echanges
    ADD CONSTRAINT fk_preteur FOREIGN KEY (utilisateur_preteur_id) REFERENCES public.utilisateurs(id) ON DELETE RESTRICT;


--
-- Name: notifications fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.utilisateurs(id) ON DELETE CASCADE;


--
-- Name: livres fk_utilisateur_livre; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.livres
    ADD CONSTRAINT fk_utilisateur_livre FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateurs(id);


--
-- Name: histo_mot_de_passe fk_utilisateur_mdp; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.histo_mot_de_passe
    ADD CONSTRAINT fk_utilisateur_mdp FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateurs(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

