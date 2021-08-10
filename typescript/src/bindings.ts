// THIS FILE WAS AUTOGENERATED DO NOT EDIT MANUALLY!, unless you know what you are doing...
export type ProviderInfo_Type = {
  before_login_hint: string;
  overview_page: string;
  status: 1 | 2 | 3;
};
export type Account_Type =
  | { id: number; type: "unconfigured" }
  | {
      id: number;
      type: "configured";
      display_name: string | null;
      addr: string | null;
      profile_image: string | null;
      color: string;
    };
export type ChatListEntry_Type = [number, number];
export type ChatListItemFetchResult_Type =
  | {
      type: "ChatListItem";
      id: number;
      name: string;
      avatarPath: null | string;
      color: string;
      lastUpdated: number;
      freshMessageCounter: number;
      summaryStatus: number;
      summaryText1: string;
      summaryText2: string;
      isArchived: boolean;
      isDeviceTalk: boolean;
      isGroup: boolean;
      isMuted: boolean;
      isPinned: boolean;
      isSelfInGroup: boolean;
      isSelfTalk: boolean;
      isSendingLocation: boolean;
      isProtected: boolean;
      isContactRequest: boolean;
    }
  | { type: "ArchiveLink" }
  | { type: "Error"; id: number; error: string };
export type FullChat_Type = {
  id: number;
  name: string;
  is_protected: boolean;
  profile_image: string;
  archived: boolean;
  chat_type: number;
  is_unpromoted: boolean;
  is_self_talk: boolean;
  contacts: Contact_Type[];
  contact_ids: number[];
  color: string;
  fresh_message_counter: number;
  is_group: boolean;
  is_deaddrop: boolean;
  is_device_chat: boolean;
  self_in_group: boolean;
  is_muted: boolean;
  ephemeral_timer: number;
};
export type Message_Type = {
  id: number;
  chat_id: number;
  from_id: number;
  quoted_text: string | null;
  quoted_message_id: number | null;
  text: string;
  has_location: boolean;
  has_html: boolean;
  view_type: number;
  state: number;

  timestamp: number;
  sort_timestamp: number;
  received_timestamp: number;
  has_deviating_timestamp: boolean;

  subject: string | null;
  show_padlock: boolean;
  is_setupmessage: boolean;
  is_info: boolean;
  is_forwarded: boolean;

  duration: number;
  dimensions_height: number | null;
  dimensions_width: number | null;

  videochat_type: number | null;
  videochat_url: string | null;
  override_sender_name: string | null;

  sender: Contact_Type;
  setup_code_begin: string | null;

  file: string | null;
  file_mime: string | null;
  file_bytes: number | null;
  file_name: string | null;
};
export type Contact_Type = {
  address: string;
  color: string;
  auth_name: string;
  status: string;
  display_name: string;
  id: number;
  name: string;
  profile_image: string;
  name_and_addr: string;
  is_blocked: boolean;
  is_verified: boolean;
};
export class RawApi {
  /**
   * @param json_transport function that executes a jsonrpc call and throws an error if one occured
   */
  constructor(
    private json_transport: (method: string, params?: any) => Promise<any>
  ) {}
  public async check_email_validity(email: string): Promise<boolean> {
    return await this.json_transport("check_email_validity", { email });
  }
  public async get_system_info(): Promise<{ [key: string]: string }> {
    return await this.json_transport("get_system_info", undefined);
  }
  public async get_provider_info(
    email: string
  ): Promise<ProviderInfo_Type | null> {
    return await this.json_transport("get_provider_info", { email });
  }
  public async add_account(): Promise<number> {
    return await this.json_transport("add_account", undefined);
  }
  public async remove_account(account_id: number): Promise<void> {
    return await this.json_transport("remove_account", { account_id });
  }
  public async get_all_account_ids(): Promise<number[]> {
    return await this.json_transport("get_all_account_ids", undefined);
  }
  public async get_all_accounts(): Promise<Account_Type[]> {
    return await this.json_transport("get_all_accounts", undefined);
  }
  public async select_account(id: number): Promise<void> {
    return await this.json_transport("select_account", { id });
  }
  public async get_selected_account_id(): Promise<number | null> {
    return await this.json_transport("get_selected_account_id", undefined);
  }
  public async sc_is_configured(): Promise<boolean> {
    return await this.json_transport("sc_is_configured", undefined);
  }
  public async sc_get_info(): Promise<{ [key: string]: string }> {
    return await this.json_transport("sc_get_info", undefined);
  }
  public async sc_set_config(key: string, value: string | null): Promise<void> {
    return await this.json_transport("sc_set_config", { key, value });
  }
  public async sc_get_config(key: string): Promise<string | null> {
    return await this.json_transport("sc_get_config", { key });
  }
  public async sc_batch_get_config(
    keys: string[]
  ): Promise<{ [key: string]: string | null }> {
    return await this.json_transport("sc_batch_get_config", { keys });
  }
  public async sc_configure(): Promise<void> {
    return await this.json_transport("sc_configure", undefined);
  }
  public async sc_stop_ongoing_process(): Promise<void> {
    return await this.json_transport("sc_stop_ongoing_process", undefined);
  }
  public async sc_get_chatlist_entries(
    list_flags: number,
    query_string: string | null,
    query_contact_id: number | null
  ): Promise<ChatListEntry_Type[]> {
    return await this.json_transport("sc_get_chatlist_entries", {
      list_flags,
      query_string,
      query_contact_id,
    });
  }
  public async sc_get_chatlist_items_by_entries(
    entries: ChatListEntry_Type[]
  ): Promise<{ [key: number]: ChatListItemFetchResult_Type }> {
    return await this.json_transport("sc_get_chatlist_items_by_entries", {
      entries,
    });
  }
  public async sc_chatlist_get_full_chat_by_id(
    chat_id: number
  ): Promise<FullChat_Type> {
    return await this.json_transport("sc_chatlist_get_full_chat_by_id", {
      chat_id,
    });
  }
  public async sc_accept_chat(chat_id: number): Promise<void> {
    return await this.json_transport("sc_accept_chat", { chat_id });
  }
  public async sc_block_chat(chat_id: number): Promise<void> {
    return await this.json_transport("sc_block_chat", { chat_id });
  }
  public async sc_message_list_get_message_ids(
    chat_id: number,
    flags: number
  ): Promise<number[]> {
    return await this.json_transport("sc_message_list_get_message_ids", {
      chat_id,
      flags,
    });
  }
  public async sc_message_get_message(
    message_id: number
  ): Promise<Message_Type> {
    return await this.json_transport("sc_message_get_message", { message_id });
  }
  public async sc_message_get_messages(
    message_ids: number[]
  ): Promise<{ [key: number]: Message_Type }> {
    return await this.json_transport("sc_message_get_messages", {
      message_ids,
    });
  }
  public async sc_contacts_get_contact(
    contact_id: number
  ): Promise<Contact_Type> {
    return await this.json_transport("sc_contacts_get_contact", { contact_id });
  }
  public async sc_misc_send_text_message(
    text: string,
    chat_id: number
  ): Promise<number> {
    return await this.json_transport("sc_misc_send_text_message", {
      text,
      chat_id,
    });
  }
}
