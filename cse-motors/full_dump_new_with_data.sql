--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    account_id integer NOT NULL,
    account_firstname character varying(100) NOT NULL,
    account_lastname character varying(100) NOT NULL,
    account_email character varying(255) NOT NULL,
    account_password text NOT NULL,
    account_type character varying(50) DEFAULT 'Client'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT account_account_type_check CHECK (((account_type)::text = ANY ((ARRAY['Client'::character varying, 'Employee'::character varying, 'Admin'::character varying])::text[])))
);


ALTER TABLE public.account OWNER TO postgres;

--
-- Name: account_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_account_id_seq OWNER TO postgres;

--
-- Name: account_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_account_id_seq OWNED BY public.account.account_id;


--
-- Name: classification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.classification (
    classification_id integer NOT NULL,
    classification_name character varying(50) NOT NULL
);


ALTER TABLE public.classification OWNER TO postgres;

--
-- Name: classification_classification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.classification_classification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.classification_classification_id_seq OWNER TO postgres;

--
-- Name: classification_classification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.classification_classification_id_seq OWNED BY public.classification.classification_id;


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory (
    inv_id integer NOT NULL,
    inv_make character varying(50) NOT NULL,
    inv_model character varying(50) NOT NULL,
    inv_year integer NOT NULL,
    inv_description text,
    inv_image character varying(255),
    inv_thumbnail character varying(255),
    inv_price numeric(10,2) NOT NULL,
    inv_miles integer NOT NULL,
    inv_color character varying(20),
    classification_id integer NOT NULL
);


ALTER TABLE public.inventory OWNER TO postgres;

--
-- Name: inventory_inv_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_inv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_inv_id_seq OWNER TO postgres;

--
-- Name: inventory_inv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_inv_id_seq OWNED BY public.inventory.inv_id;


--
-- Name: account account_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account ALTER COLUMN account_id SET DEFAULT nextval('public.account_account_id_seq'::regclass);


--
-- Name: classification classification_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classification ALTER COLUMN classification_id SET DEFAULT nextval('public.classification_classification_id_seq'::regclass);


--
-- Name: inventory inv_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory ALTER COLUMN inv_id SET DEFAULT nextval('public.inventory_inv_id_seq'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account (account_id, account_firstname, account_lastname, account_email, account_password, account_type, created_at, updated_at) FROM stdin;
1	Admin	User	admin@example.com	$2a$10$N9qo8uLOickgx2ZMRZoMye.ML7rQh1F.8R4yB8L5Cw6XUcYzJ7tW2	Admin	2025-12-08 16:36:17.176945	2025-12-08 16:36:17.176945
2	Happy	Employee	employee@example.com	$2a$10$N9qo8uLOickgx2ZMRZoMye.ML7rQh1F.8R4yB8L5Cw6XUcYzJ7tW2	Employee	2025-12-08 16:36:17.176945	2025-12-08 16:36:17.176945
3	Basic	Client	client@example.com	$2a$10$N9qo8uLOickgx2ZMRZoMye.ML7rQh1F.8R4yB8L5Cw6XUcYzJ7tW2	Client	2025-12-08 16:36:17.176945	2025-12-08 16:36:17.176945
\.


--
-- Data for Name: classification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.classification (classification_id, classification_name) FROM stdin;
1	TestClass
2	Sedan
7	Uganda
10	Edwin
12	Sudan
13	edwin
14	SUV
15	Truck
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory (inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) FROM stdin;
1	Durban	X	2018	The first of its kind to be assembled in Africa.	.	.	20000.00	30000	Green	13
2	Durban	X	2018	First of Its kind.	.	.	30000.00	20000	Green	13
3	Durban	X	2005	First made in the 1990, Durban. It's part of the first make in the Chimp Family.			100000.00	50000	Blue	13
\.


--
-- Name: account_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_account_id_seq', 3, true);


--
-- Name: classification_classification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.classification_classification_id_seq', 15, true);


--
-- Name: inventory_inv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_inv_id_seq', 3, true);


--
-- Name: account account_account_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_account_email_key UNIQUE (account_email);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (account_id);


--
-- Name: classification classification_classification_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classification
    ADD CONSTRAINT classification_classification_name_key UNIQUE (classification_name);


--
-- Name: classification classification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classification
    ADD CONSTRAINT classification_pkey PRIMARY KEY (classification_id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (inv_id);


--
-- Name: inventory inventory_classification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_classification_id_fkey FOREIGN KEY (classification_id) REFERENCES public.classification(classification_id);


--
-- Name: TABLE account; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.account TO csemotors_user;


--
-- Name: SEQUENCE account_account_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT USAGE ON SEQUENCE public.account_account_id_seq TO csemotors_user;


--
-- Name: TABLE classification; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.classification TO csemotors_user;


--
-- Name: SEQUENCE classification_classification_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.classification_classification_id_seq TO csemotors_user;


--
-- Name: TABLE inventory; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.inventory TO csemotors_user;


--
-- Name: SEQUENCE inventory_inv_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.inventory_inv_id_seq TO csemotors_user;


--
-- PostgreSQL database dump complete
--

